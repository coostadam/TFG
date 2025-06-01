package com.app.implementations;

import com.app.interfaces.GestorDAO;
import com.app.pojo.EstadoIncidencia;
import com.app.pojo.Gestor;
import com.app.pojo.Incidencia;
import com.app.pojo.Tecnico;
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
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.estado IN (:estados)", Incidencia.class)
              .setParameterList("estados", List.of(EstadoIncidencia.ALTA, EstadoIncidencia.EN_ESPERA))
              .getResultList();
    }

    @Override
    public Incidencia getIncidenciaById(long id) {
        return session.createQuery("SELECT i FROM Incidencia i WHERE i.id = :id", Incidencia.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public boolean asigTecnico(Tecnico tecnico, Incidencia i, Gestor gest) {      
        Transaction transaction = null;

        try {            
            transaction = session.beginTransaction();

            Query query = session.createQuery(
                    "UPDATE Incidencia i SET i.tecnico = :tecnico, i.estado = :estado, i.fechaApertura = :fecha, i.gestor = :gestor WHERE i.id = :id"
            );
            query.setParameter("tecnico", tecnico);
            query.setParameter("estado", EstadoIncidencia.ASIGNADA);
            query.setParameter("fecha", Date.valueOf(LocalDate.now()));
            query.setParameter("id", i.getId());
            query.setParameter("gestor", gest);

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
    public List<Tecnico> getTecnicos() {
        return session.createQuery("SELECT u FROM Tecnico u", Tecnico.class)
                .getResultList();
    }

    @Override
    public void close() throws Exception {
        session.close();
    }
}
