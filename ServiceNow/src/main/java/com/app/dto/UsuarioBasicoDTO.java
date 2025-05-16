package com.app.dto;

import com.app.pojo.UsuarioBasico;

public class UsuarioBasicoDTO {
    private Long id;
    private String username;

    public UsuarioBasicoDTO(UsuarioBasico usuario) {
        this.id = usuario.getId();
        this.username = usuario.getUsuario();
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
