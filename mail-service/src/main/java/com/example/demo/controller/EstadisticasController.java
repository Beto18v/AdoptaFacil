package com.example.demo.controller;

import com.example.demo.dto.EstadisticasDTO;
import com.example.demo.service.PdfGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticasController {
    
    @Autowired
    private PdfGeneratorService pdfGeneratorService;
    
    @PostMapping("/generar-pdf")
public ResponseEntity<byte[]> generarPdf(@RequestBody EstadisticasDTO datos) {
    try {
        System.out.println("Título: " + datos.getTitulo());
        System.out.println("Fecha Inicio: " + datos.getFechaInicio());
        System.out.println("Fecha Fin: " + datos.getFechaFin());
        System.out.println("Datos Generales: " + datos.getDatosGenerales());
        System.out.println("Tabla Detalle size: " + (datos.getTablaDetalle() != null ? datos.getTablaDetalle().size() : "null"));
        
        byte[] pdfBytes = pdfGeneratorService.generarReporteEstadisticas(datos);
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String filename = "Reportes_Estadisticos " + timestamp + ".pdf";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        System.out.println("PDF generado exitosamente: " + pdfBytes.length + " bytes");
        
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        
    } catch (Exception e) {
        System.err.println("Error al general el pdf:");
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Microservicio de estadísticas funciona correctamente");
    }
}