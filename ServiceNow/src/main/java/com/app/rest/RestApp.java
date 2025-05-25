package com.app.rest;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/resources")
public class RestApp extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(AuthService.class);
        classes.add(UsuarioBasicoServices.class);
        classes.add(CORSFilter.class);
        return classes;
    } 
}
