package com.app.implementations;

import com.app.interfaces.TecnicoDAO;
import com.app.pojo.EstadoIncidencia;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
import com.app.pojo.TipoIncidencia;
import com.app.utils.HibernateUtil;
import org.hibernate.Session;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

public class TecnicoDAOimpl implements TecnicoDAO, AutoCloseable {

     Session session;

    public TecnicoDAOimpl() {
        this.session = HibernateUtil.getSessionFactory().openSession();
    }

    @Override
    public boolean cerrarIncidencia(long id, String solucion) {
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

                    Query query2 = session.createQuery("UPDATE Incidencia i SET i.estado = :estado, i.fechaCierre = :fecha WHERE i.id = :id");
                    query2.setParameter("estado", EstadoIncidencia.CERRADA_EXITO);
                    query2.setParameter("fecha", Date.valueOf(LocalDate.now()));
                    query2.setParameter("id", id);

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
    public Incidencia getIncidenciaById(long id) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.id = :id", Incidencia.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public List<Incidencia> listarIncidenciasAsignadas(Tecnico t) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.tecnico = :tecnico", Incidencia.class)
                .setParameter("tecnico", t)
                .getResultList();
    }

    @Override
    public TipoIncidencia addTipoDeIncidencia(TipoIncidencia tipoIncidencia) {
        session.beginTransaction();
        session.persist(tipoIncidencia);
        session.getTransaction().commit();
        return tipoIncidencia;
    }

    @Override
    public List<Tecnico> ListarTecnicosDisponibles() {
        return session.createQuery("SELECT t FROM Tecnico t WHERE (SELECT COUNT(i) FROM Incidencia i WHERE i.tecnico = t AND i.estado <> 'cerrada_exito') < 5",
                Tecnico.class)
                .getResultList();
    }

    @Override
    public void close() throws Exception {
        session.close();
    }
}
