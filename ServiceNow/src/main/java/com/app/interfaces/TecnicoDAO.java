package com.app.interfaces;

import com.app.pojo.*;

import java.sql.Date;
import java.util.List;

public interface TecnicoDAO {

    boolean cerrarIncidencia(long id, String solucion);

    List<Incidencia> listarIncidenciasAsignadas(Tecnico t);

    TipoIncidencia addTipoDeIncidencia(TipoIncidencia tipoIncidencia);

    List<Tecnico> ListarTecnicosDisponibles();

    Incidencia getIncidenciaById(long id);
}
