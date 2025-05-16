package com.app.dto;

import com.app.pojo.Tecnico;

public class TecnicoDTO {

    private Long id;
    private String username;
    private String correo;

    public TecnicoDTO(Tecnico tec) {
        this.id = tec.getId();
        this.username = tec.getUsuario();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
