package com.app.interfaces;

import com.app.pojo.*;

import java.util.List;

public interface AdministradorDAO {
    List<Usuario> getUsuarios();

    List<Usuario> getUsuariosByTipo(TipoUsuario tipo);

    List<Dispositivo> getDispositivos();

    List<Dispositivo> getDispositivosByTipo(String tipo);

    boolean cerrarIncidencia(long id,  String solucion, Administrador admin) throws Exception;
    
    boolean ponerIncidenciaEspera(long id, Administrador admin);

    List<Incidencia>  getIncidenciasByUser(Usuario usuario);

    List<Incidencia>  getIncidenciasByGestor(Gestor gestor);

    List<Incidencia>  getIncidenciasByTecnico(Tecnico tecnico);

    List<Incidencia>  getIncidenciasByTipo(TipoIncidencia tipo);
    
    List<Incidencia> getAllIncidencias();
    
    boolean asigAdmin(Administrador a, Incidencia i);
}
