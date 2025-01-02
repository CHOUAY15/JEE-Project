/*
package ma.projet.grpc.serviceexamen.service;

import jakarta.transaction.Transactional;

import ma.projet.grpc.serviceexamen.dto.Local;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.Session;
import ma.projet.grpc.serviceexamen.entity.SurveillanceAssignation;
import ma.projet.grpc.serviceexamen.feignClients.EnseignantClient;
import ma.projet.grpc.serviceexamen.feignClients.LocalClient;
import ma.projet.grpc.serviceexamen.optaplanner.domain.SurveillanceSchedule;
import ma.projet.grpc.serviceexamen.repository.SessionRepository;
import ma.projet.grpc.serviceexamen.repository.ExamenRepository;
import ma.projet.grpc.serviceexamen.repository.SurveillanceAssignationRepository;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AutoAssignmentService {

    @Autowired
    private SolverFactory<SurveillanceSchedule> solverFactory;

    @Autowired
    private SurveillanceAssignationRepository surveillanceRepository;

    @Autowired
    private ExamenRepository examenRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private LocalClient localClient;

    @Autowired
    private EnseignantClient enseignantClient;

    @Transactional
    public void autoAssignSurveillances(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        List<Examen> examens = examenRepository.findBySessionId(sessionId);

        List<Long> allEnseignants = enseignantClient.getAllEnseignants()
                .stream()
                .map(e -> e.getId())
                .collect(Collectors.toList());

        List<Local> availableLocaux = localClient.getLocauxDisponibles();

        SurveillanceSchedule problem = new SurveillanceSchedule();
        problem.setExamens(examens);
        problem.setAvailableEnseignants(allEnseignants);

        // Fixed reversed list
        // First collect to list
        List<Long> locauxIds = availableLocaux.stream()
                .map(local -> Long.valueOf(local.getId()))  // Explicitly convert to Long
                .collect(Collectors.toList());

        Collections.reverse(locauxIds);
        problem.setLocaux(locauxIds);

        problem.setSession(session);

        Solver<SurveillanceSchedule> solver = solverFactory.buildSolver();
        SurveillanceSchedule solution = solver.solve(problem);

        saveSolution(solution);
    }
    @Transactional
    protected void saveSolution(SurveillanceSchedule solution) {
        // Supprimer les anciennes assignations pour la session
        surveillanceRepository.deleteAllBySession(solution.getSession());

        // Mélanger aléatoirement la liste des surveillances
        List<SurveillanceAssignation> newAssignations = solution.getSurveillances()
                .stream()
                .map(assignation -> {
                    SurveillanceAssignation entity = new SurveillanceAssignation();
                    entity.setSession(solution.getSession());
                    entity.setEnseignant(assignation.getEnseignant());
                    entity.setExamen(assignation.getExamen());
                    entity.setLocal(assignation.getLocal());
                    entity.setTypeSurveillant(assignation.getTypeSurveillant());
                    entity.setDate(assignation.getDate());
                    entity.setHoraire(assignation.getHoraire());
                    return entity;
                })
                .collect(Collectors.toList());

        // Mélanger la liste avant de sauvegarder
        Collections.shuffle(newAssignations);

        // Sauvegarder les nouvelles assignations
        surveillanceRepository.saveAll(newAssignations);
    }

}*/
