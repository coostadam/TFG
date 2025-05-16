/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.app.pojo;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Gestor extends Usuario {


   @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "gestor")
    private Set<Incidencia> incidencias = new HashSet<>();

    public Gestor(String usuario, String nombre, String apellido, String correo, String tlfno, String password, TipoUsuario tipoUsuario) {
        super(usuario, nombre, apellido, correo, tlfno, password, tipoUsuario);
    }

    public Gestor() {

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
