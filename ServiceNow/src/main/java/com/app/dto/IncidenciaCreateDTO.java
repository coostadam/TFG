package com.app.dto;

public class IncidenciaCreateDTO {
    private String prioridad;
    private String dispositivoNombre;
    private String tipo;
    private String descripcion;

    public IncidenciaCreateDTO() {}

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getDispositivoNombre() {
        return dispositivoNombre;
    }

    public void setDispositivoNombre(String dispositivoNombre) {
        this.dispositivoNombre = dispositivoNombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    
}

