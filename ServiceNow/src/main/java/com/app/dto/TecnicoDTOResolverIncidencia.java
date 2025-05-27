package com.app.dto;

import com.app.pojo.Tecnico;

public class TecnicoDTOResolverIncidencia {

    private String username;
    private String correo;

    public TecnicoDTOResolverIncidencia() {
    }

    public TecnicoDTOResolverIncidencia(Tecnico tec) {
        this.username = tec.getUsuario();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
