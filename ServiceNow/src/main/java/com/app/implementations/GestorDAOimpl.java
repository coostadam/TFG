package com.app.implementations;

import com.app.interfaces.GestorDAO;
import com.app.pojo.EstadoIncidencia;
import com.app.pojo.Gestor;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
import com.app.pojo.TipoIncidencia;
import com.app.utils.HibernateUtil;
import jakarta.persistence.Query;
import java.sql.Date;
import java.time.LocalDate;
import org.hibernate.Session;

import java.util.List;
import org.hibernate.Transaction;

public class GestorDAOimpl implements GestorDAO, AutoCloseable {

    Session session;

    public GestorDAOimpl() {
        this.session = HibernateUtil.getSessionFactory().openSession();
    }

    @Override
    public List<Incidencia> getIncidenciasIfEspera() {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.estado = :estado", Incidencia.class)
                .setParameter("estado", EstadoIncidencia.ALTA)
                .getResultList();
    }

    @Override
    public List<Incidencia> getIncidenciasByTecnico(Tecnico tecnico) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.tecnico = :tecnico", Incidencia.class)
                .setParameter("tecnico", tecnico)
                .getResultList();
    }

    @Override
    public List<Incidencia> listarIncidenciasPorTipo(TipoIncidencia tipo) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.tipo = :tipo", Incidencia.class)
                .setParameter("tipo", tipo)
                .getResultList();
    }

    @Override
    public Incidencia getIncidenciaById(long id) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.id = :id", Incidencia.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public boolean asigGestor(Gestor g, Incidencia i) {
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            Query query = session.createQuery(
                    "UPDATE Incidencia i SET i.gestor = :gestor WHERE i.id = :id"
            );
            query.setParameter("gestor", g);
            query.setParameter("id", i.getId());

            int result = query.executeUpdate();
            if (result > 0) {
                Incidencia incidencia = session.find(Incidencia.class, i.getId());
                if (incidencia != null && incidencia.getTipo() != null) {
                    System.out.println("Gestor asignado correctamente.");

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
    public boolean asigTecnico(List<Tecnico> tecnicos, Incidencia i) {
        if (tecnicos == null || tecnicos.isEmpty()) {
            return false;
        }

        Transaction transaction = null;

        try {
            Tecnico tecnico = tecnicos.get(0);
            transaction = session.beginTransaction();

            Query query = session.createQuery(
                    "UPDATE Incidencia i SET i.tecnico = :tecnico, i.estado = :estado, i.fechaApertura = :fecha WHERE i.id = :id"
            );
            query.setParameter("tecnico", tecnico);
            query.setParameter("estado", EstadoIncidencia.ASIGNADA);
            query.setParameter("fecha", Date.valueOf(LocalDate.now()));
            query.setParameter("id", i.getId());

            int result = query.executeUpdate();

            if (result > 0) {

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
    public void close() throws Exception {
        session.close();
    }
}
