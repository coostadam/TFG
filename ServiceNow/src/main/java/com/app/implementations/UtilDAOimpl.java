package com.app.implementations;

import com.app.pojo.*;
import org.hibernate.Session;
import com.app.interfaces.UtilDAO;
import com.app.utils.HibernateUtil;
import com.app.utils.Util;
import java.util.List;

public class UtilDAOimpl implements UtilDAO, AutoCloseable {

    Session session;

    public UtilDAOimpl() {
        session = HibernateUtil.getSessionFactory().openSession();
    }

    @Override
    public Administrador addAdmin(Administrador admin) {
        session.beginTransaction();
        session.persist(admin);
        session.getTransaction().commit();
        return admin;
    }

    @Override
    public Dispositivo addDispositivo(Dispositivo dispositivo) {
        session.beginTransaction();
        session.persist(dispositivo);
        session.getTransaction().commit();
        return dispositivo;
    }

    @Override
    public Gestor addGestor(Gestor gestor) {
        session.beginTransaction();
        session.persist(gestor);
        session.getTransaction().commit();
        return gestor;
    }

    @Override
    public Incidencia addIncidencia(Incidencia incidencia) {
        session.beginTransaction();
        session.persist(incidencia);
        session.getTransaction().commit();
        return incidencia;
    }

    @Override
    public Tecnico addTecnico(Tecnico tecnico) {
        session.beginTransaction();
        session.persist(tecnico);
        session.getTransaction().commit();
        return tecnico;
    }

    @Override
    public TipoIncidencia addTipoIncidencia(TipoIncidencia tipoIncidencia) {
        session.beginTransaction();
        session.persist(tipoIncidencia);
        session.getTransaction().commit();
        return tipoIncidencia;
    }

    @Override
    public UsuarioBasico addUsuarioBasico(UsuarioBasico usuarioBasico) {
        session.beginTransaction();
        session.persist(usuarioBasico);
        session.getTransaction().commit();
        return usuarioBasico;
    }

    @Override
    public boolean checkLog(String user, String pass) {
        String passHash = session.createQuery("SELECT u.password FROM Usuario u WHERE u.usuario = :user", String.class)
                .setParameter("user", user)
                .getSingleResult();
        if (Util.checkPassword(pass, passHash)) {
            return true;
        }
        return false;
    }

    @Override
    public TipoUsuario checkRol(String user) {
        return session.createQuery("SELECT u.tipoUsuario FROM Usuario u WHERE u.usuario = :user", TipoUsuario.class)
                .setParameter("user", user)
                .getSingleResult();
    }

    @Override
    public Usuario getUsuario(String user) {
        try {
            return session.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :user", Usuario.class)
                    .setParameter("user", user)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Tecnico getTecnico(String user) {
        return session.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :user", Tecnico.class)
                .setParameter("user", user)
                .getSingleResult();
    }

    @Override
    public UsuarioBasico getUsuarioBasico(String user) {
        return session.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :user", UsuarioBasico.class)
                .setParameter("user", user)
                .getSingleResult();
    }

    @Override
    public List<TipoIncidencia> getTiposIncidencia() {
        return session.createQuery("SELECT t FROM TipoIncidencia t", TipoIncidencia.class)
                .getResultList();
    }

    @Override
    public List<Incidencia> getIncidenciaByEspera() {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.estado = :estado", Incidencia.class)
                .setParameter("estado", EstadoIncidencia.EN_ESPERA)
                .getResultList();
    }

    @Override
    public List<Incidencia> getIncidenciaByTipo(TipoIncidencia tipo) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.tipo = :tipo", Incidencia.class)
                .setParameter("tipo", tipo)
                .getResultList();
    }

    @Override
    public Gestor getGestor(String user) {
        return session.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :user", Gestor.class)
                .setParameter("user", user)
                .getSingleResult();
    }

    @Override
    public TipoIncidencia getTipoIncidenciaByName(String name) {
        return session.createQuery("SELECT t FROM TipoIncidencia t WHERE t.nombre = :tipo", TipoIncidencia.class)
                .setParameter("tipo", name)
                .getSingleResult();
    }

    @Override
    public Tecnico getTecnicoById(long id) {
        return session.createQuery("SELECT u FROM Usuario u WHERE u.id = :id", Tecnico.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public Administrador getAdmin(String user) {
        return session.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :user", Administrador.class)
                .setParameter("user", user)
                .getSingleResult();
    }
    
    
    @Override
    public String getPass(Usuario u) {
        return session.createQuery("SELECT u.password FROM Usuario u WHERE u.usuario = :user", String.class)
                .setParameter("user", u.getUsuario())
                .getSingleResult();
    }

    @Override
    public void close() throws Exception {
        session.close();
    }
}
