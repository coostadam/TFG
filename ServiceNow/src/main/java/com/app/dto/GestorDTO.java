package com.app.dto;

import com.app.pojo.Gestor;

public class GestorDTO {
      private Long id;
    private String username;

    public GestorDTO(Gestor gest) {
        this.id = gest.getId();
        this.username = gest.getUsuario();
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
