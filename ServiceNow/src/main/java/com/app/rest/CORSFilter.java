package com.app.rest;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Provider
public class CORSFilter implements ContainerResponseFilter {

    private static final List<String> allowedOrigins = Arrays.asList(
            "http://localhost:3000"
    );

    @Override
    public void filter(ContainerRequestContext requestContext,
            ContainerResponseContext responseContext) throws IOException {
        String origin = requestContext.getHeaderString("Origin");
        if (origin != null && allowedOrigins.contains(origin)) {
            MultivaluedMap<String, Object> headers = responseContext.getHeaders();
            headers.add("Access-Control-Allow-Origin", origin);
            headers.add("Access-Control-Allow-Credentials", "true");
            headers.add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
            headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        }

    }
}
