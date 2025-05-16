/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.app.pojo;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Administrador extends Usuario {

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "administrador")
    private Set<Incidencia> incidencias = new HashSet<>();

    public Administrador(String usuario, String nombre, String apellido, String correo, String tlfno, String password, TipoUsuario tipoUsuario) {
        super(usuario, nombre, apellido, correo, tlfno, password, tipoUsuario);
    }

    public Administrador() {

    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Set<Incidencia> getIncidencias() {
        return incidencias;
    }

    public void setIncidencias(Set<Incidencia> incidencias) {
        this.incidencias = incidencias;
    }
}
