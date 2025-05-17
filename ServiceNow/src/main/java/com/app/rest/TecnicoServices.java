package com.app.rest;

import com.app.dto.IncidenciaDTO;
import com.app.dto.SolucionDTO;
import com.app.implementations.TecnicoDAOimpl;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
import com.app.pojo.TipoIncidencia;
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
import java.util.List;
import java.util.stream.Collectors;

@Path("/tecnico")
public class TecnicoServices {

    @GET
    @Path("/incidencia/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIncidenciaByID(@PathParam("id") Long id, @Context HttpServletRequest request) {
        Tecnico t = (Tecnico) request.getSession().getAttribute("usuario");

        if (t == null && request.getSession().getAttribute("tipo") != "TECNICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (TecnicoDAOimpl tdi = new TecnicoDAOimpl()) {
            Incidencia i = tdi.getIncidenciaById(id);
            IncidenciaDTO result = new IncidenciaDTO(i);
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/incidencias/misIncidencias")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIncidenciasTecnico(@Context HttpServletRequest request) {
        Tecnico t = (Tecnico) request.getSession().getAttribute("usuario");

        if (t == null && request.getSession().getAttribute("tipo") != "TECNICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (TecnicoDAOimpl tdi = new TecnicoDAOimpl()) {
            List<Incidencia> incidencias = tdi.listarIncidenciasAsignadas(t);
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
    @Path("/addTipo/{tipo}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addTipoIncidencia(@PathParam("tipo") String tipo, @Context HttpServletRequest request) {
        Tecnico t = (Tecnico) request.getSession().getAttribute("usuario");

        if (t == null && request.getSession().getAttribute("tipo") != "TECNICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (TecnicoDAOimpl tdi = new TecnicoDAOimpl()) {
            TipoIncidencia tipoIncidencia = new TipoIncidencia(tipo);
            tdi.addTipoDeIncidencia(tipoIncidencia);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @POST
    @Path("/cerrarIncidencia/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response cerrarIncidencia(@PathParam("id") long id, SolucionDTO solucionDTO, @Context HttpServletRequest request) {
        Tecnico t = (Tecnico) request.getSession().getAttribute("usuario");

        if (t == null && request.getSession().getAttribute("tipo") != "TECNICO") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (TecnicoDAOimpl tdi = new TecnicoDAOimpl()) {
            boolean resultado = tdi.cerrarIncidencia(id, solucionDTO.getSolucion());
            if (resultado) {
                return Response.ok().build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("No se pudo cerrar la incidencia")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError()
                    .build();
        }
    }

}
