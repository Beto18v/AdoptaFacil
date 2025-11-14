package com.example.demo.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.example.demo.dto.EstadisticasDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class PdfGeneratorService {

    // Colores y Fuentes del PDF
    private static final BaseColor COLOR_HEADER = new BaseColor(0, 150, 100);
    private static final BaseColor COLOR_HEADER_TEXT = BaseColor.WHITE;
    private static final BaseColor COLOR_ROW_ALT = new BaseColor(245, 245, 245);
    private static final BaseColor COLOR_BORDER = new BaseColor(220, 220, 220);

    private static final Font FONT_TITLE = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
    private static final Font FONT_SUBTITLE = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
    private static final Font FONT_NORMAL = new Font(Font.FontFamily.HELVETICA, 12);
    private static final Font FONT_SMALL = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
    private static final Font FONT_HEADER = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, COLOR_HEADER_TEXT);

    public byte[] generarReporteEstadisticas(EstadisticasDTO datos) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            //Titulo
            Paragraph titulo = new Paragraph(
                    datos.getTitulo() != null ? datos.getTitulo() : "Reporte de Estadísticas",
                    FONT_TITLE
            );
            titulo.setAlignment(Element.ALIGN_LEFT);
            titulo.setSpacingAfter(5);
            document.add(titulo);

            // Fecha de la generacion del pdf
            String fechaActual = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph fechaGen = new Paragraph("Generado el: " + fechaActual, FONT_SMALL);
            fechaGen.setAlignment(Element.ALIGN_LEFT);
            fechaGen.setSpacingAfter(15);
            document.add(fechaGen);

            // periodo del reporte
            if (datos.getFechaInicio() != null && datos.getFechaFin() != null) {
                Paragraph periodo = new Paragraph(
                        "Periodo de estadisticas del: " + datos.getFechaInicio() + " al " + datos.getFechaFin(),
                        FONT_NORMAL
                );
                periodo.setSpacingAfter(10);
                document.add(periodo);
            }

            document.add(new LineSeparator());
            document.add(Chunk.NEWLINE);

            // Tabla Resumen General
            if (datos.getDatosGenerales() != null && !datos.getDatosGenerales().isEmpty()) {
                Paragraph subtitulo = new Paragraph("Resumen General", FONT_SUBTITLE);
                subtitulo.setSpacingAfter(10);
                document.add(subtitulo);

                PdfPTable tablaResumen = new PdfPTable(2);
                tablaResumen.setWidthPercentage(100);
                tablaResumen.setSpacingAfter(20);

                boolean alternar = false;

                for (Map.Entry<String, Object> entry : datos.getDatosGenerales().entrySet()) {

                    PdfPCell keyCell = new PdfPCell(new Phrase(entry.getKey(), FONT_NORMAL));
                    keyCell.setPadding(8);
                    keyCell.setBorderColor(COLOR_BORDER);
                    keyCell.setBackgroundColor(COLOR_HEADER);
                    keyCell.setPhrase(new Phrase(entry.getKey(), FONT_HEADER));
                    
                    PdfPCell valueCell = new PdfPCell(new Phrase(String.valueOf(entry.getValue()), FONT_NORMAL));
                    valueCell.setPadding(8);
                    valueCell.setBorderColor(COLOR_BORDER);
                    valueCell.setBackgroundColor(alternar ? COLOR_ROW_ALT : BaseColor.WHITE);

                    tablaResumen.addCell(keyCell);
                    tablaResumen.addCell(valueCell);

                    alternar = !alternar;
                }

                document.add(tablaResumen);
            }

            // Tabla Detalle de Registros
            if (datos.getTablaDetalle() != null && !datos.getTablaDetalle().isEmpty()) {
                Paragraph subtituloDetalle = new Paragraph("Detalle de Registros", FONT_SUBTITLE);
                subtituloDetalle.setSpacingAfter(10);
                document.add(subtituloDetalle);

                Map<String, Object> primerRegistro = datos.getTablaDetalle().get(0);
                int numColumnas = primerRegistro.size();

                PdfPTable tablaDetalle = new PdfPTable(numColumnas);
                tablaDetalle.setWidthPercentage(100);
                tablaDetalle.setSpacingAfter(20);

                // Encabezados
                for (String key : primerRegistro.keySet()) {
                    PdfPCell header = new PdfPCell(new Phrase(key, FONT_HEADER));
                    header.setBackgroundColor(COLOR_HEADER);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setBorderColor(COLOR_BORDER);
                    header.setPadding(8);
                    tablaDetalle.addCell(header);
                }
                boolean alternar = false;

                for (Map<String, Object> fila : datos.getTablaDetalle()) {
                    for (Object valor : fila.values()) {
                        PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(valor), FONT_NORMAL));
                        cell.setPadding(8);
                        cell.setBorderColor(COLOR_BORDER);
                        if (alternar) {
                            cell.setBackgroundColor(COLOR_ROW_ALT);
                        }
                        tablaDetalle.addCell(cell);
                    }
                    alternar = !alternar;
                }

                document.add(tablaDetalle);
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new DocumentException("Error generando PDF: " + e.getMessage());
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }

        return baos.toByteArray();
    }
}
