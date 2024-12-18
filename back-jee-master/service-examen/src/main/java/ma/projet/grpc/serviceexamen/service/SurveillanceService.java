package ma.projet.grpc.serviceexamen.service;

import ma.projet.grpc.servicedepartement.entity.Enseignant;
import ma.projet.grpc.servicedepartement.entity.Local;
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


    SurveillanceAssignation assignSurveillant(SurveillanceAssignation assignation);
}
