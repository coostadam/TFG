package com.app.interfaces;

import com.app.pojo.*;

import java.util.List;

public interface GestorDAO {
    boolean asigTecnico(Tecnico tecnico, Incidencia i, Gestor gest);

    List<Incidencia> getIncidenciasIfEspera();
 
    Incidencia getIncidenciaById(long id);

    List<Tecnico> getTecnicos();
}
