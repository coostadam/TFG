package com.app.dto;

import com.app.pojo.EstadoIncidencia;
import com.app.pojo.Incidencia;
import java.sql.Date;

public class IncidenciaDTO {

    private Long id;
    private String descripcion;
    private EstadoIncidencia estado;
    private Date fechaCreacion;
    private Date fechaApertura;
    private Date fechaCierre;

    private UsuarioBasicoDTO usuario;
    private AdministradorDTO administrador;
    private TecnicoDTO tecnico;
    private GestorDTO gestor;

    public IncidenciaDTO(Incidencia incidencia) {
        this.id = incidencia.getId();
        this.descripcion = incidencia.getDescripcion();
        this.estado = incidencia.getEstado();
        this.fechaCreacion = incidencia.getFechaApertura();

        if (incidencia.getUsuario() != null) {
            this.usuario = new UsuarioBasicoDTO(incidencia.getUsuario());
        }

        if (incidencia.getAdministrador() != null) {
            this.administrador = new AdministradorDTO(incidencia.getAdministrador());
        }

        if (incidencia.getTecnico() != null) {
            this.tecnico = new TecnicoDTO(incidencia.getTecnico());
        }

        if (incidencia.getGestor() != null) {
            this.gestor = new GestorDTO(incidencia.getGestor());
        }

        if (incidencia.getFechaCierre() != null) {
            this.fechaCierre = incidencia.getFechaCierre();
        }

        if (incidencia.getFechaApertura() != null) {
            this.fechaCierre = incidencia.getFechaApertura();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public EstadoIncidencia getEstado() {
        return estado;
    }

    public void setEstado(EstadoIncidencia estado) {
        this.estado = estado;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public UsuarioBasicoDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioBasicoDTO usuario) {
        this.usuario = usuario;
    }

    public AdministradorDTO getAdministrador() {
        return administrador;
    }

    public void setAdministrador(AdministradorDTO administrador) {
        this.administrador = administrador;
    }

    public TecnicoDTO getTecnico() {
        return tecnico;
    }

    public void setTecnico(TecnicoDTO tecnico) {
        this.tecnico = tecnico;
    }

    public GestorDTO getGestor() {
        return gestor;
    }

    public void setGestor(GestorDTO gestor) {
        this.gestor = gestor;
    }

    public Date getFechaApertura() {
        return fechaApertura;
    }

    public void setFechaApertura(Date fechaApertura) {
        this.fechaApertura = fechaApertura;
    }

    public Date getFechaCierre() {
        return fechaCierre;
    }

    public void setFechaCierre(Date fechaCierre) {
        this.fechaCierre = fechaCierre;
    }

}
