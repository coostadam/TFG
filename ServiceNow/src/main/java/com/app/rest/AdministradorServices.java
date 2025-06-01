package com.app.rest;

import com.app.dto.IncidenciaDTO;
import com.app.dto.RolDTO;
import com.app.dto.UsuarioDTO;
import com.app.implementations.AdministradorDAOimpl;
import com.app.implementations.TecnicoDAOimpl;
import com.app.implementations.UtilDAOimpl;
import com.app.pojo.Administrador;
import com.app.pojo.Gestor;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
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
    @Path("/allIncidencias")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllIncidencias(@Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
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
                i = tdi.getIncidenciaById(id);
                IncidenciaDTO dto = new IncidenciaDTO(i);
                return Response.ok(dto).build();
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
    @Path("/changeRol/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeRol(@PathParam("username") String user, RolDTO rolDto, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            Usuario targetUser = udi.getUsuario(user);
            if (targetUser == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Usuario no encontrado")
                        .build();
            }

            String password = udi.getPass(targetUser);
            String rol = rolDto.getRol().toUpperCase();

            adi.deleteUser(targetUser);

            Usuario nuevoUsuario;
            switch (rol) {
                case "TECNICO":
                    nuevoUsuario = new Tecnico();
                    break;
                case "ADMINISTRADOR":
                    nuevoUsuario = new Administrador();
                    break;
                case "GESTOR":
                    nuevoUsuario = new Gestor();
                    break;
                case "USUARIO_BASICO":
                    nuevoUsuario = new UsuarioBasico();
                    break;
                default:
                    throw new IllegalArgumentException("Rol inválido: " + rol);
            }

            if (nuevoUsuario == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Rol inválido")
                        .build();
            }

            nuevoUsuario.setUsuario(targetUser.getUsuario());
            nuevoUsuario.setNombre(targetUser.getNombre());
            nuevoUsuario.setApellido(targetUser.getApellido());
            nuevoUsuario.setCorreo(targetUser.getCorreo());
            nuevoUsuario.setTlfno(targetUser.getTlfno());
            nuevoUsuario.setPassword(password);
            nuevoUsuario.setTipoUsuario(TipoUsuario.valueOf(rol));

            switch (rol) {
                case "TECNICO":
                    udi.addTecnico((Tecnico) nuevoUsuario);
                    break;
                case "ADMINISTRADOR":
                    udi.addAdmin((Administrador) nuevoUsuario);
                    break;
                case "GESTOR":
                    udi.addGestor((Gestor) nuevoUsuario);
                    break;
                case "USUARIO_BASICO":
                    udi.addUsuarioBasico((UsuarioBasico) nuevoUsuario);
                    break;
                default:
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("Rol inválido: " + rol)
                            .build();
            }

            return Response.ok(new UsuarioDTO(nuevoUsuario)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    @POST
    @Path("/deleteUser/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response borrarUser(@PathParam("username") String user, @Context HttpServletRequest request) {
        Administrador a = (Administrador) request.getSession().getAttribute("usuario");
        if (a == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("No autenticado")
                    .build();
        }

        try (AdministradorDAOimpl adi = new AdministradorDAOimpl(); UtilDAOimpl udi = new UtilDAOimpl()) {
            Usuario targetUser = udi.getUsuario(user);
            if (targetUser == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Usuario no encontrado")
                        .build();
            }

            boolean res = adi.deleteUser(targetUser);

            if (res) {
                return Response.ok().build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("No se pudo borrar el usuario")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

}
