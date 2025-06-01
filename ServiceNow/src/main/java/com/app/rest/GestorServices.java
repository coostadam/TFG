package com.app.rest;

import com.app.dto.IncidenciaDTO;
import com.app.implementations.GestorDAOimpl;
import com.app.implementations.UtilDAOimpl;
import com.app.pojo.Gestor;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Random;
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
    @Produces(MediaType.APPLICATION_JSON)
    public Response asignarTecnico(@PathParam("idIncidencia") Long idIncidencia, @Context HttpServletRequest request) {
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
            
            List<Tecnico> tecnicos = gdi.getTecnicos();
            
             if (tecnicos.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("No hay técnicos disponibles")
                        .build();
            }
            
            Random random = new Random();
            int indiceAleatorio = random.nextInt(tecnicos.size()); 
            Tecnico tecnico = tecnicos.get(indiceAleatorio);

            boolean result = gdi.asigTecnico(tecnico, i, asig);

            if (result) {
                return Response.ok(tecnico.getUsuario()).build();
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
}
