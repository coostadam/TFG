package com.app.dto;

import com.app.pojo.Tecnico;

public class TecnicoDTO {

    private Long id;
    private String username;
    private String correo;

    public TecnicoDTO() {
    }

    public TecnicoDTO(Tecnico tec) {
        this.id = tec.getId();
        this.username = tec.getUsuario();
    }
    
    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
