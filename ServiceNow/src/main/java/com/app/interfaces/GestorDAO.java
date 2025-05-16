package com.app.interfaces;

import com.app.pojo.*;

import java.util.List;

public interface GestorDAO {
    Incidencia addIncidencia(Incidencia incidencia);

    Tecnico asigTecnico(List<Tecnico> tecnicos, Incidencia i);

    List<Incidencia> getIncidenciasIfEspera();

    List<Incidencia> getIncidenciasByTecnico(Tecnico tecnico);

    List<Incidencia> listarIncidenciasPorTipo(TipoIncidencia tipo);

    boolean asigGestor(Gestor g, Incidencia i);

}
