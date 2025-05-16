package com.app.interfaces;

import com.app.pojo.*;

import java.util.List;

public interface UsuarioBasicoDAO {
    Incidencia addIncidencia (Incidencia incidencia);

    List<Incidencia> listarMisIncidencias(UsuarioBasico u);

    Incidencia getIncidenciaById(long id);
}
