package com.app.implementations;

import com.app.interfaces.AdministradorDAO;
import com.app.pojo.*;
import com.app.utils.HibernateUtil;
import org.hibernate.Session;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

public class AdministradorDAOimpl implements AdministradorDAO, AutoCloseable {

      Session session;

    public AdministradorDAOimpl() {
        this.session = HibernateUtil.getSessionFactory().openSession();
    }

    @Override
    public List<Usuario> getUsuarios() {
        return session.createQuery("SELECT u FROM Usuario u", Usuario.class).getResultList();
    }

    @Override
    public List<Usuario> getUsuariosByTipo(TipoUsuario tipo) {
        return session.createQuery("SELECT u FROM Usuario u WHERE u.tipoUsuario = :tipo ", Usuario.class)
                .setParameter("tipo", tipo)
                .getResultList();
    }

    @Override
    public List<Dispositivo> getDispositivos() {
        return session.createQuery("SELECT d FROM Dispositivo d", Dispositivo.class).getResultList();
    }

    @Override
    public List<Dispositivo> getDispositivosByTipo(String tipo) {
        return session.createQuery("SELECT d FROM Dispositivo d WHERE d.tipo = :tipo", Dispositivo.class)
                .setParameter("tipo", tipo)
                .getResultList();
    }

    @Override
    public boolean cerrarIncidencia(long id, String solucion, Administrador admin) throws Exception {
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();

            Query query = session.createQuery("UPDATE Incidencia i SET i.solucion = :solucion WHERE i.id = :id");
            query.setParameter("solucion", solucion);
            query.setParameter("id", id);

            int result = query.executeUpdate();
            if (result > 0) {
                if (session.find(Incidencia.class, id).getTipo() != null) {

                    System.out.println("Incidencia actualizada correctamente.");

                    Query query2 = session.createQuery("UPDATE Incidencia i SET i.estado = :estado, i.fechaCierre = :fecha, i.administrador = :admin, i.fechaApertura = :aper WHERE i.id = :id");
                    query2.setParameter("estado", EstadoIncidencia.CERRADA_EXITO);
                    query2.setParameter("fecha", Date.valueOf(LocalDate.now()));
                    query2.setParameter("id", id);
                    query2.setParameter("admin", admin);
                    query2.setParameter("aper", Date.valueOf(LocalDate.now()));

                    query2.executeUpdate();
                    transaction.commit();

                    return true;
                } else {
                    transaction.rollback();
                    return false;
                }
            } else {
                transaction.rollback();
                return false;
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Incidencia> getIncidenciasByUser(Usuario usuario) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.usuario = :usuario", Incidencia.class)
                .setParameter("usuario", usuario)
                .getResultList();
    }

    @Override
    public List<Incidencia> getIncidenciasByGestor(Gestor gestor) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.gestor = :gestor", Incidencia.class)
                .setParameter("gestor", gestor)
                .getResultList();
    }

    @Override
    public List<Incidencia> getIncidenciasByTecnico(Tecnico tecnico) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.tecnico = :tecnico", Incidencia.class)
                .setParameter("tecnico", tecnico)
                .getResultList();
    }

    @Override
    public List<Incidencia> getIncidenciasByTipo(TipoIncidencia tipo) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.tipo = :tipo", Incidencia.class)
                .setParameter("tipo", tipo)
                .getResultList();
    }

    @Override
    public List<Incidencia> getAllIncidencias() {
        return session.createQuery("SELECT i FROM Incidencia i", Incidencia.class)
                .getResultList();
    }

    @Override
    public boolean ponerIncidenciaEspera(long id, Administrador admin) {
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();

            if (session.find(Incidencia.class, id).getTipo() != null) {

                System.out.println("Incidencia actualizada correctamente.");

                Query query = session.createQuery("UPDATE Incidencia i SET i.estado = :estado, i.administrador = :admin WHERE i.id = :id");
                query.setParameter("estado", EstadoIncidencia.EN_ESPERA);
                query.setParameter("admin", admin);
                query.setParameter("id", id);

                query.executeUpdate();
                transaction.commit();

                return true;
            } else {
                transaction.rollback();
                return false;
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public boolean asigAdmin(Administrador a, Incidencia i) {
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            jakarta.persistence.Query query = session.createQuery(
                    "UPDATE Incidencia i SET i.administrador = :admin WHERE i.id = :id"
            );
            query.setParameter("admin", a);
            query.setParameter("id", i.getId());

            int result = query.executeUpdate();
            if (result > 0) {
                Incidencia incidencia = session.find(Incidencia.class, i.getId());
                if (incidencia != null && incidencia.getTipo() != null) {
                    System.out.println("Administrador asignado correctamente.");

                    transaction.commit();
                    return true;
                } else {
                    transaction.rollback();
                    return false;
                }
            } else {
                transaction.rollback();
                return false;
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void close() throws Exception {
        session.close();
    }
}
