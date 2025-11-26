package com.example.demo.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.example.demo.dto.EstadisticasDTO;
import org.springframework.stereotype.Service;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PiePlot;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import java.awt.Color;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
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

    // Colores para el gráfico
    private static final BaseColor[] CHART_COLORS = {
            new BaseColor(52, 152, 219), // Azul
            new BaseColor(46, 204, 113), // Verde
            new BaseColor(241, 196, 15), // Amarillo
            new BaseColor(231, 76, 60), // Rojo
            new BaseColor(155, 89, 182), // Púrpura
            new BaseColor(230, 126, 34), // Naranja
            new BaseColor(149, 165, 166), // Gris
            new BaseColor(26, 188, 156) // Turquesa
    };

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

            // Título
            Paragraph titulo = new Paragraph(
                    datos.getTitulo() != null ? datos.getTitulo() : "Reporte de Estadísticas",
                    FONT_TITLE);
            titulo.setAlignment(Element.ALIGN_LEFT);
            titulo.setSpacingAfter(5);
            document.add(titulo);

            // Fecha de generación
            String fechaActual = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph fechaGen = new Paragraph("Generado el: " + fechaActual, FONT_SMALL);
            fechaGen.setAlignment(Element.ALIGN_LEFT);
            fechaGen.setSpacingAfter(15);
            document.add(fechaGen);

            // Periodo del reporte
            if (datos.getFechaInicio() != null && datos.getFechaFin() != null) {
                Paragraph periodo = new Paragraph(
                        "Periodo de estadísticas del: " + datos.getFechaInicio() + " al " + datos.getFechaFin(),
                        FONT_NORMAL);
                periodo.setSpacingAfter(10);
                document.add(periodo);
            }

            document.add(new LineSeparator());
            document.add(Chunk.NEWLINE);

            // Gráfico y Tabla de Distribución por Especies

            if (datos.getDistribucionEspecies() != null && !datos.getDistribucionEspecies().isEmpty()) {
                document.add(Chunk.NEWLINE);

                Paragraph subtituloEspecies = new Paragraph("Distribución de Adopciones por Especie", FONT_SUBTITLE);
                subtituloEspecies.setSpacingAfter(15);
                document.add(subtituloEspecies);

                try {
                    // Crear el dataset para el gráfico de torta
                    DefaultPieDataset dataset = new DefaultPieDataset();

                    // Tabla de datos detallados
                    Paragraph subtituloTablaEspecies = new Paragraph("Detalle Numérico de Especies", FONT_SUBTITLE);
                    subtituloTablaEspecies.setSpacingAfter(10);
                    document.add(subtituloTablaEspecies);

                    PdfPTable tablaEspecies = new PdfPTable(3);
                    tablaEspecies.setWidthPercentage(100);
                    tablaEspecies.setSpacingAfter(20);

                    // Headers
                    String[] headers = { "Especie", "Cantidad", "Porcentaje" };
                    for (String header : headers) {
                        PdfPCell cell = new PdfPCell(new Phrase(header, FONT_HEADER));
                        cell.setBackgroundColor(COLOR_HEADER);
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setBorderColor(COLOR_BORDER);
                        cell.setPadding(8);
                        tablaEspecies.addCell(cell);
                    }

                    // Datos
                    boolean alternar = false;
                    for (Map<String, Object> especie : datos.getDistribucionEspecies()) {
                        for (Object valor : especie.values()) {
                            PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(valor), FONT_NORMAL));
                            cell.setPadding(8);
                            cell.setBorderColor(COLOR_BORDER);
                            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                            if (alternar) {
                                cell.setBackgroundColor(COLOR_ROW_ALT);
                            }
                            tablaEspecies.addCell(cell);
                        }
                        alternar = !alternar;
                    }

                    document.add(tablaEspecies);

                    for (Map<String, Object> especie : datos.getDistribucionEspecies()) {
                        String nombre = String.valueOf(especie.get("Especie"));
                        String cantidadStr = String.valueOf(especie.get("Cantidad"));

                        try {
                            int cantidad = Integer.parseInt(cantidadStr);
                            dataset.setValue(nombre, cantidad);
                        } catch (NumberFormatException e) {
                            System.err.println("Error parseando cantidad: " + cantidadStr);
                        }
                    }

                    // Creamos el gráfico de torta
                    JFreeChart pieChart = ChartFactory.createPieChart(
                            null,
                            dataset,
                            true,
                            true,
                            false);

                    // Personalizar colores del gráfico
                    PiePlot plot = (PiePlot) pieChart.getPlot();
                    plot.setBackgroundPaint(Color.WHITE);
                    plot.setOutlineVisible(false);
                    plot.setShadowPaint(null);

                    // Colores personalizados para cada sección
                    Color[] colores = {
                            new Color(52, 152, 219), // Azul
                            new Color(46, 204, 113), // Verde
                            new Color(241, 196, 15), // Amarillo
                            new Color(231, 76, 60), // Rojo
                            new Color(155, 89, 182), // Púrpura
                            new Color(230, 126, 34), // Naranja
                            new Color(149, 165, 166), // Gris
                            new Color(26, 188, 156) // Turquesa
                    };

                    int colorIndex = 0;
                    for (Map<String, Object> especie : datos.getDistribucionEspecies()) {
                        String nombre = String.valueOf(especie.get("Especie"));
                        plot.setSectionPaint(nombre, colores[colorIndex % colores.length]);
                        colorIndex++;
                    }

                    // Convertir el gráfico a imagen
                    BufferedImage chartImage = pieChart.createBufferedImage(500, 350);
                    ByteArrayOutputStream chartOutputStream = new ByteArrayOutputStream();
                    ImageIO.write(chartImage, "PNG", chartOutputStream);

                    // Agregar la imagen al PDF
                    Image chartImg = Image.getInstance(chartOutputStream.toByteArray());
                    chartImg.scaleToFit(450, 300);
                    chartImg.setAlignment(Element.ALIGN_CENTER);
                    document.add(chartImg);
                    document.add(Chunk.NEWLINE);

                } catch (Exception e) {
                    System.err.println("Error generando gráfico de torta: " + e.getMessage());
                    e.printStackTrace();

                    Paragraph errorMsg = new Paragraph(
                            "No se pudo generar el gráfico visual",
                            FONT_SMALL);
                    errorMsg.setAlignment(Element.ALIGN_CENTER);
                    document.add(errorMsg);
                    document.add(Chunk.NEWLINE);
                }

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

    public byte[] generarReporteRechazos(EstadisticasDTO datos) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Título
            Paragraph titulo = new Paragraph(
                    datos.getTitulo() != null ? datos.getTitulo() : "Reporte de Motivos de Rechazo",
                    FONT_TITLE);
            titulo.setAlignment(Element.ALIGN_LEFT);
            titulo.setSpacingAfter(5);
            document.add(titulo);

            // Fecha de generación
            String fechaActual = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph fechaGen = new Paragraph("Generado el: " + fechaActual, FONT_SMALL);
            fechaGen.setAlignment(Element.ALIGN_LEFT);
            fechaGen.setSpacingAfter(15);
            document.add(fechaGen);

            // Periodo del reporte
            if (datos.getFechaInicio() != null && datos.getFechaFin() != null) {
                Paragraph periodo = new Paragraph(
                        "Periodo analizado: " + datos.getFechaInicio() + " al " + datos.getFechaFin(),
                        FONT_NORMAL);
                periodo.setSpacingAfter(10);
                document.add(periodo);
            }

            document.add(new LineSeparator());
            document.add(Chunk.NEWLINE);

            // Resumen de datos generales
            if (datos.getDatosGenerales() != null && !datos.getDatosGenerales().isEmpty()) {
                Paragraph subtituloResumen = new Paragraph("Resumen General", FONT_SUBTITLE);
                subtituloResumen.setSpacingAfter(10);
                document.add(subtituloResumen);

                PdfPTable tablaResumen = new PdfPTable(2);
                tablaResumen.setWidthPercentage(100);
                tablaResumen.setWidths(new float[] { 3, 1 });
                tablaResumen.setSpacingAfter(20);

                for (Map.Entry<String, Object> entry : datos.getDatosGenerales().entrySet()) {
                    PdfPCell cellLabel = new PdfPCell(new Phrase(entry.getKey(), FONT_NORMAL));
                    cellLabel.setPadding(8);
                    cellLabel.setBorderColor(COLOR_BORDER);
                    cellLabel.setBackgroundColor(COLOR_ROW_ALT);
                    tablaResumen.addCell(cellLabel);

                    PdfPCell cellValue = new PdfPCell(new Phrase(String.valueOf(entry.getValue()), FONT_NORMAL));
                    cellValue.setPadding(8);
                    cellValue.setBorderColor(COLOR_BORDER);
                    cellValue.setHorizontalAlignment(Element.ALIGN_CENTER);
                    tablaResumen.addCell(cellValue);
                }

                document.add(tablaResumen);
            }

            // Gráfico y tabla de motivos de rechazo
            if (datos.getMotivosRechazo() != null && !datos.getMotivosRechazo().isEmpty()) {
                Paragraph subtituloMotivos = new Paragraph("Distribución de Motivos de Rechazo", FONT_SUBTITLE);
                subtituloMotivos.setSpacingAfter(15);
                document.add(subtituloMotivos);

                try {
                    // Crear dataset para gráfico de barras
                    DefaultCategoryDataset dataset = new DefaultCategoryDataset();

                    for (Map<String, Object> motivo : datos.getMotivosRechazo()) {
                        String nombre = String.valueOf(motivo.get("Motivo"));
                        String cantidadStr = String.valueOf(motivo.get("Cantidad"));

                        try {
                            int cantidad = Integer.parseInt(cantidadStr);
                            // Truncar nombres muy largos para mejor visualización
                            String nombreCorto = nombre.length() > 30 ? nombre.substring(0, 27) + "..." : nombre;
                            dataset.addValue(cantidad, "Rechazos", nombreCorto);
                        } catch (NumberFormatException e) {
                            System.err.println("Error parseando cantidad: " + cantidadStr);
                        }
                    }

                    // Crear gráfico de barras
                    JFreeChart barChart = ChartFactory.createBarChart(
                            null, // título del gráfico
                            "Motivo de Rechazo", // etiqueta eje X
                            "Cantidad", // etiqueta eje Y
                            dataset, // datos
                            org.jfree.chart.plot.PlotOrientation.VERTICAL,
                            false, // incluir leyenda
                            true, // tooltips
                            false // URLs
                    );

                    // Personalizar el gráfico
                    org.jfree.chart.plot.CategoryPlot plot = barChart.getCategoryPlot();
                    plot.setBackgroundPaint(Color.WHITE);
                    plot.setOutlineVisible(false);
                    plot.setRangeGridlinePaint(new Color(200, 200, 200));
                    plot.setDomainGridlinesVisible(false);

                    // Personalizar el renderizador de barras
                    org.jfree.chart.renderer.category.BarRenderer renderer = (org.jfree.chart.renderer.category.BarRenderer) plot
                            .getRenderer();

                    // Asignar colores a las barras
                    Color[] colores = {
                            new Color(231, 76, 60), // Rojo
                            new Color(241, 196, 15), // Amarillo
                            new Color(230, 126, 34), // Naranja
                            new Color(155, 89, 182), // Púrpura
                            new Color(149, 165, 166), // Gris
                            new Color(52, 152, 219), // Azul
                            new Color(46, 204, 113), // Verde
                            new Color(26, 188, 156) // Turquesa
                    };

                    for (int i = 0; i < datos.getMotivosRechazo().size(); i++) {
                        renderer.setSeriesPaint(0, colores[i % colores.length]);
                    }

                    // Hacer las barras más bonitas
                    renderer.setBarPainter(new org.jfree.chart.renderer.category.StandardBarPainter());
                    renderer.setShadowVisible(false);
                    renderer.setMaximumBarWidth(0.10); // Ancho de las barras

                    // Personalizar ejes
                    org.jfree.chart.axis.CategoryAxis domainAxis = plot.getDomainAxis();
                    domainAxis.setTickLabelFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 9));
                    domainAxis.setCategoryLabelPositions(
                            org.jfree.chart.axis.CategoryLabelPositions.UP_45);

                    org.jfree.chart.axis.NumberAxis rangeAxis = (org.jfree.chart.axis.NumberAxis) plot.getRangeAxis();
                    rangeAxis.setStandardTickUnits(org.jfree.chart.axis.NumberAxis.createIntegerTickUnits());

                    // Convertir gráfico a imagen
                    BufferedImage chartImage = barChart.createBufferedImage(500, 350);
                    ByteArrayOutputStream chartOutputStream = new ByteArrayOutputStream();
                    ImageIO.write(chartImage, "PNG", chartOutputStream);

                    Image chartImg = Image.getInstance(chartOutputStream.toByteArray());
                    chartImg.scaleToFit(450, 300);
                    chartImg.setAlignment(Element.ALIGN_CENTER);
                    document.add(chartImg);
                    document.add(Chunk.NEWLINE);

                } catch (Exception e) {
                    System.err.println("Error generando gráfico: " + e.getMessage());
                    e.printStackTrace();
                }

                // Tabla detallada de motivos
                Paragraph subtituloTabla = new Paragraph("Detalle de Motivos", FONT_SUBTITLE);
                subtituloTabla.setSpacingAfter(10);
                document.add(subtituloTabla);

                PdfPTable tablaMotivos = new PdfPTable(2);
                tablaMotivos.setWidthPercentage(100);
                tablaMotivos.setWidths(new float[] { 4, 1 });
                tablaMotivos.setSpacingAfter(20);

                // Headers
                String[] headers = { "Motivo de Rechazo", "Cantidad" };
                for (String header : headers) {
                    PdfPCell cell = new PdfPCell(new Phrase(header, FONT_HEADER));
                    cell.setBackgroundColor(COLOR_HEADER);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    cell.setBorderColor(COLOR_BORDER);
                    cell.setPadding(8);
                    tablaMotivos.addCell(cell);
                }

                // Datos
                boolean alternar = false;
                for (Map<String, Object> motivo : datos.getMotivosRechazo()) {
                    for (Object valor : motivo.values()) {
                        PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(valor), FONT_NORMAL));
                        cell.setPadding(8);
                        cell.setBorderColor(COLOR_BORDER);
                        if (alternar) {
                            cell.setBackgroundColor(COLOR_ROW_ALT);
                        }
                        tablaMotivos.addCell(cell);
                    }
                    alternar = !alternar;
                }

                document.add(tablaMotivos);
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

    // Convierte un string de porcentaje a float
    private float parsePercentage(String porcentaje) {
        try {
            // Eliminar el símbolo %
            String numStr = porcentaje.replace("%", "").trim();
            float valor = Float.parseFloat(numStr);
            return Math.max(5f, Math.min(100f, valor));
        } catch (Exception e) {
            System.err.println("Error parsing percentage: " + porcentaje);
            return 10f; // Valor por defecto
        }
    }
}