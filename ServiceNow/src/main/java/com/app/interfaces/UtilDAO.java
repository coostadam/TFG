package com.app.interfaces;

import com.app.pojo.*;
import java.util.List;

public interface UtilDAO {

    Administrador addAdmin(Administrador admin);

    Dispositivo addDispositivo(Dispositivo dispositivo);

    Gestor addGestor(Gestor gestor);

    Incidencia addIncidencia(Incidencia incidencia);

    Tecnico addTecnico(Tecnico tecnico);

    TipoIncidencia addTipoIncidencia(TipoIncidencia tipoIncidencia);

    UsuarioBasico addUsuarioBasico(UsuarioBasico usuarioBasico);

    boolean checkLog(String user, String pass);

    TipoUsuario checkRol(String user);
    
    Usuario getUsuario(String user);

    UsuarioBasico getUsuarioBasico(String user);

    Tecnico getTecnico(String user);
    
    List<TipoIncidencia> getTiposIncidencia();
    
    List<Incidencia> getIncidenciaByEspera();
    
    List<Incidencia> getIncidenciaByTipo(TipoIncidencia tipo);
    
    Gestor getGestor(String user);
    
    TipoIncidencia getTipoIncidenciaByName(String name);
    
    Tecnico getTecnicoById(long id);
    
    Administrador getAdmin(String user);
}
