
package com.app.pojo;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "Usuario_basico")
public class UsuarioBasico extends Usuario {

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; 
    
    @OneToMany(mappedBy = "usuario",cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Incidencia> incidencias = new HashSet<>();

    public UsuarioBasico(String usuario, String nombre, String apellido, String correo, String tlfno, String password, TipoUsuario tipoUsuario) {
        super(usuario, nombre, apellido, correo, tlfno, password, tipoUsuario);
    }

    public UsuarioBasico() {

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
