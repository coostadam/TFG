package com.app.dto;

import com.app.pojo.Administrador;

public class AdministradorDTO {
    private Long id;
    private String username;
    private String correo;

    public AdministradorDTO(Administrador admin) {
        this.id = admin.getId();
        this.username = admin.getUsuario();
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
