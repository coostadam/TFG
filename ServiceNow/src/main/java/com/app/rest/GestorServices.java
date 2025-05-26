package com.app.rest;

import com.app.dto.IncidenciaDTO;
import com.app.dto.TecnicoDTO;
import com.app.dto.TecnicoDTOResolverIncidencia;
import com.app.implementations.GestorDAOimpl;
import com.app.implementations.TecnicoDAOimpl;
import com.app.implementations.UtilDAOimpl;
import com.app.pojo.Gestor;
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

@Path("/gestor")
public class GestorServices {

    @GET
    @Path("/incidencia")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIncidenciaIfEspera(@Context HttpServletRequest request) {
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");
        if (g == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (GestorDAOimpl gdi = new GestorDAOimpl()) {
            List<Incidencia> incidencias = gdi.getIncidenciasIfEspera();
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
    @Path("/asignarTecnico/{idIncidencia}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response asignarTecnico(@PathParam("idIncidencia") Long idIncidencia, TecnicoDTOResolverIncidencia tecnicoDTO, @Context HttpServletRequest request) {
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");

        if (g == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (GestorDAOimpl gdi = new GestorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            Incidencia i = gdi.getIncidenciaById(idIncidencia);
            Gestor asig = udi.getGestor(g.getUsuario());

            if (i == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Incidencia no encontrada")
                        .build();
            }

            Tecnico tecnico = udi.getTecnico(tecnicoDTO.getUsername());

            if (tecnico == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Técnico no encontrado")
                        .build();
            }

            boolean result = gdi.asigTecnico(tecnico, i, asig);

            if (result) {
                return Response.ok("Técnico asignado correctamente.").build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Error al asignar el técnico")
                        .build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Error interno del servidor.").build();
        }
    }

    @GET
    @Path("/getTecnicos")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTecnicos(@Context HttpServletRequest request) {
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");

        if (g == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (GestorDAOimpl gdi = new GestorDAOimpl();) {
            List<Tecnico> disponibles = gdi.getTecnicos();
            List<TecnicoDTO> result = disponibles.stream()
                    .filter(u -> u instanceof Tecnico)
                    .map(u -> new TecnicoDTO((Tecnico) u))
                    .collect(Collectors.toList());

            if (true) {
                return Response.ok(result).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Error al asignar el tecnico")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Error interno del servidor.").build();
        }
    }

}
