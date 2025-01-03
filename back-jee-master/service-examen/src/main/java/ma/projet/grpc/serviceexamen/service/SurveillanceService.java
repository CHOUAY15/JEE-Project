package ma.projet.grpc.serviceexamen.service;


import ma.projet.grpc.serviceexamen.dto.Enseignant;
import ma.projet.grpc.serviceexamen.dto.ExamenResponse;
import ma.projet.grpc.serviceexamen.dto.Local;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.SurveillanceAssignation;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SurveillanceService {
    List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId);
    List<Examen> getExamensByDateAndHoraire(LocalDate date, String horaire, Long sessionId);
    boolean assignerSurveillant(Long examenId, Long enseignantId, Long localId, String typeSurveillant);
    List<Enseignant> getEnseignantsDisponibles(Long departementId, LocalDate date, String periode);
    List<Local> getLocauxDisponibles(LocalDate date, String horaire);
    boolean verifierContraintesSurveillance(Long examenId, Long enseignantId, Long localId, String typeSurveillant);
    int getNombreSurveillantRequis(int nbEtudiants);
    List<SurveillanceAssignation> getAssignmentsBySession(Long sessionId);
    void deleteById(Long id);
    List<ExamenResponse> getExamensByDateAndHoraireres(LocalDate date, String horaire, Long sessionId);


    SurveillanceAssignation assignSurveillant(SurveillanceAssignation assignation);
}
