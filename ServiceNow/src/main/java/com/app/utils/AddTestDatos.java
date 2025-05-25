package com.app.utils;

import com.app.implementations.*;
import com.app.pojo.*;
import java.util.Date;

public class AddTestDatos {

    public static void addDatos() {
        try (UtilDAOimpl udi = new UtilDAOimpl()) {
            UsuarioBasico usuario1 = new UsuarioBasico("user01", "Carlos", "Pérez", "carlos@example.com", "123456789", Util.hashPassword("pass123"), TipoUsuario.USUARIO_BASICO);
            UsuarioBasico usuario2 = new UsuarioBasico("user02", "Ana", "Martínez", "ana@example.com", "987123456", Util.hashPassword("pass456"), TipoUsuario.USUARIO_BASICO);
            udi.addUsuarioBasico(usuario1);
            udi.addUsuarioBasico(usuario2);

            Tecnico tecnico1 = new Tecnico("tech01", "Laura", "Gómez", "laura@example.com", "987654321", Util.hashPassword("techpass"), TipoUsuario.TECNICO);
            Tecnico tecnico2 = new Tecnico("tech02", "Pedro", "Ramírez", "pedro@example.com", "654321987", Util.hashPassword("techpass2"), TipoUsuario.TECNICO);
            udi.addTecnico(tecnico1);
            udi.addTecnico(tecnico2);

            Gestor gestor1 = new Gestor("gest01", "Andrés", "López", "andres@example.com", "654987321", Util.hashPassword("gestpass"), TipoUsuario.GESTOR);
            Administrador admin1 = new Administrador("admin01", "María", "Fernández", "maria@example.com", "321654987", Util.hashPassword("adminpass"), TipoUsuario.ADMINISTRADOR);
            udi.addGestor(gestor1);
            udi.addAdmin(admin1);

            Dispositivo dispositivo = new Dispositivo("Ordenador portátil");
            udi.addDispositivo(dispositivo);

            TipoIncidencia tipo1 = new TipoIncidencia("Fallo en el sistema");
            TipoIncidencia tipo2 = new TipoIncidencia("Error de red");
            TipoIncidencia tipo3 = new TipoIncidencia("Problema de hardware");
            TipoIncidencia tipo4 = new TipoIncidencia("Virus detectado");
            TipoIncidencia tipo5 = new TipoIncidencia("Error en la aplicación");
            udi.addTipoIncidencia(tipo1);
            udi.addTipoIncidencia(tipo2);
            udi.addTipoIncidencia(tipo3);
            udi.addTipoIncidencia(tipo4);
            udi.addTipoIncidencia(tipo5);

            Incidencia incidencia1 = new Incidencia(EstadoIncidencia.ALTA, Prioridad.ALTA, null, usuario1, null, null, dispositivo, tipo1, "El sistema no responde al iniciar sesión", "");
            Incidencia incidencia2 = new Incidencia(EstadoIncidencia.ASIGNADA, Prioridad.MEDIA, gestor1, usuario2, tecnico1, admin1, dispositivo, tipo2, "La conexión a internet es inestable", "");
            incidencia2.setFechaApertura(new java.sql.Date(new Date().getTime()));
            Incidencia incidencia3 = new Incidencia(EstadoIncidencia.EN_ESPERA, Prioridad.BAJA, null, usuario1, null, admin1, dispositivo, tipo3, "El teclado no responde", "");
            Incidencia incidencia4 = new Incidencia(EstadoIncidencia.CERRADA_EXITO, Prioridad.MUY_ALTA, gestor1, usuario2, tecnico1, admin1, dispositivo, tipo4, "El antivirus ha detectado una amenaza crítica", "Sistema limpiado");
            incidencia4.setFechaApertura(new java.sql.Date(new Date().getTime()));
            incidencia4.setFechaCierre(new java.sql.Date(new Date().getTime()));
            Incidencia incidencia5 = new Incidencia(EstadoIncidencia.EN_ESPERA, Prioridad.ALTA, null, usuario1, null, admin1, dispositivo, tipo5, "La aplicación se cierra inesperadamente", "No se ha encontrado solución");

            incidencia1.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            incidencia2.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            incidencia3.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            incidencia4.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            incidencia5.setFechaEntrada(new java.sql.Date(new Date().getTime()));

            incidencia1.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            udi.addIncidencia(incidencia1);
            incidencia2.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            udi.addIncidencia(incidencia2);
            incidencia3.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            udi.addIncidencia(incidencia3);
            incidencia4.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            udi.addIncidencia(incidencia4);
            incidencia5.setFechaEntrada(new java.sql.Date(new Date().getTime()));
            udi.addIncidencia(incidencia5);

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
