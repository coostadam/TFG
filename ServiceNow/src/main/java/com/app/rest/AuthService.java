/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.app.rest;

import com.app.implementations.UtilDAOimpl;
import com.app.pojo.TipoUsuario;
import com.app.pojo.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
public class AuthService {

    @POST
    @Path("/log")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest loginRequest, @Context HttpServletRequest request) throws Exception {
        boolean esValido;
        try (UtilDAOimpl udi = new UtilDAOimpl()) {
            esValido = udi.checkLog(loginRequest.username, loginRequest.password);

            if (!esValido) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Usuario o contraseña incorrectos").build();
            }

            TipoUsuario tipo = udi.checkRol(loginRequest.username);
            Usuario user = null;
            switch (tipo) {
                case USUARIO_BASICO:
                    user = udi.getUsuario(loginRequest.username);
                    break;
                case TECNICO:
                    user = udi.getTecnico(loginRequest.username);
                    break;
                case ADMINISTRADOR:
                    user = udi.getAdmin(loginRequest.username);
                    break;
                case GESTOR:
                    user = udi.getGestor(loginRequest.username);
                    break;
                default:
                    return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                            .entity("Tipo de usuario no reconocido")
                            .build();
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("usuario", user);
            session.setAttribute("tipo", tipo);

            return Response.ok("Login correcto").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Error al validar usuario").build();
        }
    }

    public static class LoginRequest {

        public String username;
        public String password;
    }
}
