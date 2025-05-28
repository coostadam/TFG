package com.app.interfaces;

import com.app.pojo.*;

import java.util.List;

public interface AdministradorDAO {
    List<Usuario> getUsuarios();

    List<Usuario> getUsuariosByTipo(TipoUsuario tipo);

    boolean cerrarIncidencia(long id,  String solucion, Administrador admin) throws Exception;
    
    boolean ponerIncidenciaEspera(long id, Administrador admin);
    
    List<Incidencia> getAllIncidencias();
    
    boolean asigAdmin(Administrador a, Incidencia i);
    
    boolean changeRolUser(Usuario user, String rol);
    
    boolean deleteUser(Usuario u);
}
