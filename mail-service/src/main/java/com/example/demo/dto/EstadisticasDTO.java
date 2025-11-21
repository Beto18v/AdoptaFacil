package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class EstadisticasDTO {
    private String titulo;
    private String fechaInicio;
    private String fechaFin;
    private Map<String, Object> datosGenerales;
    private List<Map<String, Object>> tablaDetalle;
    private List<Map<String, Object>> distribucionEspecies;

    // Constructores
    public EstadisticasDTO() {}
    
    public EstadisticasDTO(String titulo, String fechaInicio, String fechaFin) {
        this.titulo = titulo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
    
    // Getters y Setters
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getFechaInicio() {
        return fechaInicio;
    }
    
    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public String getFechaFin() {
        return fechaFin;
    }
    
    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public Map<String, Object> getDatosGenerales() {
        return datosGenerales;
    }
    
    public void setDatosGenerales(Map<String, Object> datosGenerales) {
        this.datosGenerales = datosGenerales;
    }
    
    public List<Map<String, Object>> getTablaDetalle() {
        return tablaDetalle;
    }
    
    public void setTablaDetalle(List<Map<String, Object>> tablaDetalle) {
        this.tablaDetalle = tablaDetalle;
    }
    public List<Map<String, Object>> getDistribucionEspecies() {
        return distribucionEspecies;
    }
    
    public void setDistribucionEspecies(List<Map<String, Object>> distribucionEspecies) {
        this.distribucionEspecies = distribucionEspecies;
    }
}