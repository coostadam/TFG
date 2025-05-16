package com.app.implementations;

import com.app.interfaces.UsuarioBasicoDAO;
import com.app.pojo.*;
import com.app.utils.HibernateUtil;
import org.hibernate.Session;

import java.util.List;

public class UsuarioBasicoDAOimpl implements UsuarioBasicoDAO, AutoCloseable{
    Session session;

    public UsuarioBasicoDAOimpl() {
        this.session = HibernateUtil.getSessionFactory().openSession();
    }

    @Override
    public Incidencia addIncidencia(Incidencia incidencia) {
        session.beginTransaction();
        session.persist(incidencia);
        session.getTransaction().commit();
        return incidencia;
    }

    @Override
    public List<Incidencia> listarMisIncidencias(UsuarioBasico u) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.usuario = :usuario", Incidencia.class)
                .setParameter("usuario", u)
                .getResultList();
    }

    @Override
    public Incidencia getIncidenciaById(long id) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.id = :id", Incidencia.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public void close() throws Exception {
        session.close();
    }
}
