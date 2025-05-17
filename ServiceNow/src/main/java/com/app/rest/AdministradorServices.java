package com.app.rest;

import com.app.dto.IncidenciaDTO;
import com.app.dto.SolucionDTO;
import com.app.dto.UsuarioDTO;
import com.app.implementations.AdministradorDAOimpl;
import com.app.implementations.TecnicoDAOimpl;
import com.app.implementations.UtilDAOimpl;
import com.app.pojo.Administrador;
import com.app.pojo.Gestor;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
import com.app.pojo.TipoIncidencia;
import com.app.pojo.TipoUsuario;
import com.app.pojo.Usuario;
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
import java.util.List;
import java.util.stream.Collectors;

@Path("/admin")
public class AdministradorServices {

    @GET
    @Path("/allUsers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers(@Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl()) {
            List<Usuario> usuarios = adi.getUsuarios();
            List<UsuarioDTO> result = usuarios.stream()
                    .map(UsuarioDTO::new)
                    .collect(Collectors.toList());
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/usersTipo/{tipo}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsersByTipo(@PathParam("tipo") String tipo, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            List<Usuario> usuarios = adi.getUsuariosByTipo(TipoUsuario.valueOf(tipo.toUpperCase()));
            List<UsuarioDTO> result = usuarios.stream()
                    .map(UsuarioDTO::new)
                    .collect(Collectors.toList());
            return Response.ok(result).build();
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
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl()) {
            boolean res = adi.cerrarIncidencia(id, solucionDTO.getSolucion(), a);
            if (res) {
                return Response.ok().build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("No se pudo cerrar la incidencia")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @GET
    @Path("/incidenciaUser/{usuario}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserIncidencia(@PathParam("usuario") String usuario, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null ) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            UsuarioBasico u = udi.getUsuario(usuario);
            if (u == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("No encontrado").build();
            }
            List<Incidencia> incidencias = adi.getIncidenciasByUser(u);
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
    @Path("/incidenciaGestor/{usuario}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGestorIncidencia(@PathParam("usuario") String usuario, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            Gestor g = udi.getGestor(usuario);
            if (g == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("No encontrado").build();
            }
            List<Incidencia> incidencias = adi.getIncidenciasByGestor(g);
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
    @Path("/incidenciaTecnico/{usuario}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTecnicoIncidencia(@PathParam("usuario") String usuario, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            Tecnico t = udi.getTecnico(usuario);
            if (t == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("No encontrado").build();
            }
            List<Incidencia> incidencias = adi.getIncidenciasByTecnico(t);
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
    @Path("/incidenciaByTipo/{tipo}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getIncidenciaByTipo(@PathParam("tipo") String tipo, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            TipoIncidencia t = udi.getTipoIncidenciaByName(tipo);
            List<Incidencia> incidencias = adi.getIncidenciasByTipo(t);
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
    @Path("/allIncidencias")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllIncidencias(@Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null ) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl()) {
            List<Incidencia> incidencias = adi.getAllIncidencias();
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
    @Path("/incidenciaEspera/{idIncidencia}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response esperaIncidencia(@PathParam("idIncidencia") long id, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl()) {
            boolean res = adi.ponerIncidenciaEspera(id, a);
            if (res) {
                return Response.ok().build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("No se pudo cerrar la incidencia")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @POST
    @Path("/asigAdmin/{idIncidencia}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response asigAdmin(@PathParam("idIncidencia") long id, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); TecnicoDAOimpl tdi = new TecnicoDAOimpl()) {
            Incidencia i = tdi.getIncidenciaById(id);
            boolean res = adi.asigAdmin(a, i);
            if (res) {
                return Response.ok().build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("No se pudo cerrar la incidencia")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

}
