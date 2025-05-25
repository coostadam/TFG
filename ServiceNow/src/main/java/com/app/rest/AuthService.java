package com.app.rest;

import com.app.implementations.UtilDAOimpl;
import com.app.pojo.TipoUsuario;
import com.app.pojo.Usuario;
import com.app.pojo.UsuarioBasico;
import com.app.utils.Util;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
public class AuthService {

    @POST
@Path("/log")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON) 
public Response login(LoginRequest loginRequest, @Context HttpServletRequest request) throws Exception {
    boolean esValido;
    try (UtilDAOimpl udi = new UtilDAOimpl()) {
        esValido = udi.checkLog(loginRequest.email, loginRequest.password);

        if (!esValido) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Usuario o contraseña incorrectos").build();
        }

        TipoUsuario tipo = udi.checkRol(loginRequest.email);
        Usuario user = null;
        switch (tipo) {
            case USUARIO_BASICO:
                user = udi.getUsuarioBasico(loginRequest.email);
                break;
            case TECNICO:
                user = udi.getTecnico(loginRequest.email);
                break;
            case ADMINISTRADOR:
                user = udi.getAdmin(loginRequest.email);
                break;
            case GESTOR:
                user = udi.getGestor(loginRequest.email);
                break;
            default:
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("Tipo de usuario no reconocido")
                        .build();
        }

        HttpSession session = request.getSession(true);
        session.setAttribute("usuario", user);
        session.setAttribute("tipo", tipo);

        JsonObject jsonResponse = Json.createObjectBuilder()
            .add("mensaje", "Login correcto")
            .add("usuario", user.getUsuario())
            .add("nombre", user.getNombre() + " " + user.getApellido())
            .add("rol", tipo.toString())
            .build();

        return Response.ok(jsonResponse).build();
    } catch (Exception e) {
        e.printStackTrace();
        return Response.serverError().entity("Error al validar usuario").build();
    }
}


    @POST
    @Path("/registro")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registro(RegistroRequest data) {
        try (UtilDAOimpl udi = new UtilDAOimpl()) {
            if (udi.getUsuario(data.usuario) != null) {
                return Response.status(Response.Status.CONFLICT)
                        .entity("El usuario ya existe")
                        .build();
            }

            UsuarioBasico nuevo = new UsuarioBasico();
            nuevo.setUsuario(data.usuario);
            nuevo.setNombre(data.nombre);
            nuevo.setApellido(data.apellido);
            nuevo.setCorreo(data.correo);
            nuevo.setTlfno(data.tlfno);
            nuevo.setPassword(Util.hashPassword(data.password));
            nuevo.setTipoUsuario(TipoUsuario.USUARIO_BASICO);

            udi.addUsuarioBasico(nuevo);

            return Response.status(Response.Status.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().build();
        }
    }

    public static class LoginRequest {

        public String email;
        public String password;
    }

    public static class RegistroRequest {

        public String usuario;
        public String nombre;
        public String apellido;
        public String correo;
        public String tlfno;
        public String password;

        public RegistroRequest() {
        }

        public RegistroRequest(String usuario, String nombre, String apellido, String correo, String tlfno, String password) {
            this.usuario = usuario;
            this.nombre = nombre;
            this.apellido = apellido;
            this.correo = correo;
            this.tlfno = tlfno;
            this.password = password;
        }
    }

}
