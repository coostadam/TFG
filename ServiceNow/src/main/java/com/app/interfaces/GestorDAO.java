package com.app.interfaces;

import com.app.pojo.*;

import java.util.List;

public interface GestorDAO {
    boolean asigTecnico(List<Tecnico> tecnicos, Incidencia i);

    List<Incidencia> getIncidenciasIfEspera();

    List<Incidencia> getIncidenciasByTecnico(Tecnico tecnico);

    List<Incidencia> listarIncidenciasPorTipo(TipoIncidencia tipo);
    
    Incidencia getIncidenciaById(long id);

    boolean asigGestor(Gestor g, Incidencia i);

}
