package ma.projet.grpc.serviceexamen.service;


import ma.projet.grpc.serviceexamen.entity.Examen;

import java.time.LocalDate;
import java.util.List;

public interface ExamenService {
    List<Examen> getExamensBySessionDateHoraire(Long sessionId, LocalDate date, String horaire);
    Examen createExamen(Examen examen);
    Examen updateExamen(Long id, Examen examen);
    void deleteExamen(Long id);
     Examen getExamenById(Long id);
    List<Examen> getAllExamens();

}