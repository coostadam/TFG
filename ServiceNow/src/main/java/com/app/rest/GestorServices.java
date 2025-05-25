package com.app.rest;

import com.app.dto.IncidenciaDTO;
import com.app.implementations.GestorDAOimpl;
import com.app.implementations.TecnicoDAOimpl;
import com.app.implementations.UtilDAOimpl;
import com.app.pojo.Gestor;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
import com.app.pojo.TipoIncidencia;
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

    @GET
    @Path("/incidencia/tecnico/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIncidenciaByTecnico(@PathParam("id") Long id, @Context HttpServletRequest request) {
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");

        if (g == null && request.getSession().getAttribute("tipo") != "GESTOR") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (GestorDAOimpl gdi = new GestorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            Tecnico tec = udi.getTecnicoById(id);
            if (tec == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Técnico no encontrado.")
                        .build();
            }
            List<Incidencia> incidencias = gdi.getIncidenciasByTecnico(tec);
            List<IncidenciaDTO> result = incidencias.stream()
                    .map(IncidenciaDTO::new)
                    .collect(Collectors.toList());
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/incidencia/tipo/{nombre}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIncidenciaByTipo(@PathParam("nombre") String nombreTipo, @Context HttpServletRequest request) {
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");

        if (g == null && request.getSession().getAttribute("tipo") != "GESTOR") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (GestorDAOimpl gdi = new GestorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            TipoIncidencia tipo = udi.getTipoIncidenciaByName(nombreTipo);

            if (tipo == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Tipo de incidencia no encontrado.")
                        .build();
            }

            List<Incidencia> incidencias = gdi.listarIncidenciasPorTipo(tipo);
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
    @Path("/asignar/{idIncidencia}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response asignarGestor(@PathParam("idIncidencia") Long idIncidencia, @Context HttpServletRequest request) {
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");
        
        if (g == null && request.getSession().getAttribute("tipo") != "GESTOR") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }


        try (GestorDAOimpl gdi = new GestorDAOimpl()) {
            Incidencia i =  gdi.getIncidenciaById(idIncidencia);

            boolean result = gdi.asigGestor(g, i);

            if (result) {
                return Response.ok("Gestor asignado correctamente.").build();
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
    
    @POST
    @Path("/asignarTecnico/{idIncidencia}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response asignarTecnico(@PathParam("idIncidencia") Long id, @Context HttpServletRequest request){
        Gestor g = (Gestor) request.getSession().getAttribute("usuario");
        
        if (g == null && request.getSession().getAttribute("tipo") != "GESTOR") {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }
        
        try (GestorDAOimpl gdi = new GestorDAOimpl();
                TecnicoDAOimpl tdi = new TecnicoDAOimpl()) {
            Incidencia i =  gdi.getIncidenciaById(id);
            List<Tecnico> disponibles = tdi.ListarTecnicosDisponibles();

            boolean result = gdi.asigTecnico(disponibles, i);

            if (result) {
                return Response.ok("Técnico asignado correctamente.").build();
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
