package com.app.rest;

import com.app.dto.IncidenciaCreateDTO;
import com.app.dto.IncidenciaDTO;
import com.app.implementations.UsuarioBasicoDAOimpl;
import com.app.implementations.UtilDAOimpl;
import com.app.pojo.Dispositivo;
import com.app.pojo.EstadoIncidencia;
import com.app.pojo.Incidencia;
import com.app.pojo.Prioridad;
import com.app.pojo.TipoIncidencia;
import com.app.pojo.UsuarioBasico;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Path("/user")
public class UsuarioBasicoServices {

    @GET
    @Path("/incidencias")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserIncidencias(@Context HttpServletRequest request) {
        UsuarioBasico u = (UsuarioBasico) request.getSession().getAttribute("usuario");
        if (u == null && request.getSession().getAttribute("tipo") != "USUARIO_BASICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (UsuarioBasicoDAOimpl udi = new UsuarioBasicoDAOimpl()) {
            List<Incidencia> incidencias = udi.listarMisIncidencias(u);
            List<IncidenciaDTO> result = incidencias.stream()
                    .map(IncidenciaDTO::new)
                    .collect(Collectors.toList());
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response crearIncidencia(IncidenciaCreateDTO dto, @Context HttpServletRequest request) {
        UsuarioBasico u = (UsuarioBasico) request.getSession().getAttribute("usuario");

        if (u == null && request.getSession().getAttribute("tipo") != "USUARIO_BASICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (UtilDAOimpl udi = new UtilDAOimpl()) {
            UsuarioBasico usuario = udi.getUsuario(u.getUsuario());

            Dispositivo dispositivo = new Dispositivo(dto.getDispositivoNombre());
            udi.addDispositivo(dispositivo);

            TipoIncidencia tipoIncidencia = udi.getTipoIncidenciaByName(dto.getTipo());

            Incidencia incidencia = new Incidencia(
                    EstadoIncidencia.ALTA,
                    Prioridad.valueOf(dto.getPrioridad().toUpperCase()),
                    null,
                    usuario,
                    null,
                    null,
                    dispositivo,
                    tipoIncidencia,
                    dto.getDescripcion(),
                    null
            );
            incidencia.setFechaEntrada(Date.valueOf(LocalDate.now()));

            udi.addIncidencia(incidencia);

            return Response.status(Response.Status.CREATED)
                    .entity(new IncidenciaDTO(incidencia))
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/incidencia/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserIncidenciasByID(@PathParam("id") Long id, @Context HttpServletRequest request) {
        UsuarioBasico u = (UsuarioBasico) request.getSession().getAttribute("usuario");
        if (u == null && request.getSession().getAttribute("tipo") != "USUARIO_BASICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (UsuarioBasicoDAOimpl udi = new UsuarioBasicoDAOimpl()) {
            Incidencia i = udi.getIncidenciaById(id);
            IncidenciaDTO result = new IncidenciaDTO(i);
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @POST
    @Path("/reabrir/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response reabrirIncidencia(@PathParam("id") Long id, @Context HttpServletRequest request) {
        UsuarioBasico u = (UsuarioBasico) request.getSession().getAttribute("usuario");
        if (u == null && request.getSession().getAttribute("tipo") != "USUARIO_BASICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (UsuarioBasicoDAOimpl udi = new UsuarioBasicoDAOimpl()) {
            Incidencia i = udi.getIncidenciaById(id);
            boolean opened = udi.reabrirIncidencia(i);
            if (opened) {
                return Response.ok("Incidencia reabierta").build();
            }else{
                return Response.status(Response.Status.NOT_MODIFIED)
                        .entity("No se pudo reabrir la incidencia")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }

    }
}
