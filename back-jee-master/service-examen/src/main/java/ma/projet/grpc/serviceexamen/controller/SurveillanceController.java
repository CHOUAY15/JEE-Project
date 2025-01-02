package ma.projet.grpc.serviceexamen.controller;

import io.micrometer.common.util.StringUtils;
import jakarta.persistence.EntityNotFoundException;
import ma.projet.grpc.serviceexamen.dto.AssignSurveillantRequest;
import ma.projet.grpc.serviceexamen.dto.ExamenResponse;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.Session;
import ma.projet.grpc.serviceexamen.entity.SurveillanceAssignation;
import ma.projet.grpc.serviceexamen.repository.SurveillanceAssignationRepository;
//import ma.projet.grpc.serviceexamen.service.AutoAssignmentService;
import ma.projet.grpc.serviceexamen.service.ExamenService;
import ma.projet.grpc.serviceexamen.service.SessionService;
import ma.projet.grpc.serviceexamen.service.SurveillanceService;
import ma.projet.grpc.serviceexamen.service.impl.SurveillanceServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/surveillance")
public class SurveillanceController {

    @Autowired
    private SurveillanceAssignationRepository surveillanceAssignationRepository;

//    @Autowired
//    private AutoAssignmentService autoAssignmentService;

    @Autowired
    private SurveillanceService surveillanceService;

    @Autowired
    private SessionService sessionService;

    @GetMapping("/emploi")
    public ResponseEntity<?> getEmploiSurveillance(
            @RequestParam Long sessionId,
            @RequestParam Long departementId) {
        return ResponseEntity.ok(surveillanceService.getEmploiSurveillance(sessionId, departementId));
    }
// bien passé
    @GetMapping("/examens")
    public ResponseEntity<?> getExamens(
            @RequestParam LocalDate date,
            @RequestParam String horaire,
            @RequestParam Long sessionId) {
        return ResponseEntity.ok(surveillanceService.getExamensByDateAndHoraire(date, horaire, sessionId));
    }

    @GetMapping("/enseignants-disponibles")
    public ResponseEntity<?> getEnseignantsDisponibles(
            @RequestParam Long departementId,
            @RequestParam LocalDate date,
            @RequestParam String periode) {
        return ResponseEntity.ok(surveillanceService.getEnseignantsDisponibles(departementId, date, periode));
    }
// bien passer
    @GetMapping("/locaux-disponibles")
    public ResponseEntity<?> getLocauxDisponibles(
            @RequestParam LocalDate date,
            @RequestParam String horaire) {
        return ResponseEntity.ok(surveillanceService.getLocauxDisponibles(date, horaire));
    }

    @PostMapping("/assigner")
    public ResponseEntity<?> assignerSurveillant(@RequestBody AssignSurveillantRequest request) {
        try {
            // Afficher les informations de la requête reçue
            System.out.println("Requête reçue pour assigner un surveillant.");
            System.out.println("ExamenId: " + request.getExamenId());
            System.out.println("EnseignantId: " + request.getEnseignantId());
            System.out.println("LocalId: " + request.getLocalId());
            System.out.println("TypeSurveillant: " + request.getTypeSurveillant());

            // Appel du service pour assigner le surveillant
            boolean success = surveillanceService.assignerSurveillant(
                    request.getExamenId(),
                    request.getEnseignantId(),
                    request.getLocalId(),
                    request.getTypeSurveillant()
            );

            // Vérifier le succès ou l'échec de l'assignation
            if (success) {
                System.out.println("Surveillant assigné avec succès.");
                return ResponseEntity.ok(Map.of("message", "Surveillant assigné avec succès."));
            } else {
                System.out.println("Échec de l'assignation du surveillant.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Échec de l'assignation du surveillant."));
            }
        } catch (RuntimeException e) {
            // Afficher l'erreur de l'exception métier
            System.out.println("Erreur lors de l'assignation du surveillant : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Afficher l'erreur d'une exception générale
            System.out.println("Erreur interne : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erreur interne: " + e.getMessage()));
        }
    }

    @Autowired
    private ExamenService examenService;
    @Autowired
    private SurveillanceServiceImpl surveillanceAssignationService; // Injection du service
// Service pour récupérer l'examen par ID

    // POST request pour créer une SurveillanceAssignation
    @DeleteMapping("/assign/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            // Ajouter des logs
            System.out.println("Deleting surveillance assignment with ID: " + id);

            // Vérifier si l'assignation existe
            Optional<SurveillanceAssignation> assignation = surveillanceAssignationRepository.findById(id);
            if (assignation.isPresent()) {
                surveillanceAssignationRepository.delete(assignation.get());
                System.out.println("Successfully deleted assignment");
                return ResponseEntity.ok().build();
            } else {
                System.out.println("Assignment not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting assignment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }



//    // Ajouter cet endpoint
//    @PostMapping("/auto-assign")
//    public ResponseEntity<?> autoAssignSurveillances(
//            @RequestParam Long sessionId) {
//        try {
//            autoAssignmentService.autoAssignSurveillances(sessionId);
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError()
//                    .body(Map.of("error", e.getMessage()));
//        }
//    }

    @GetMapping("/examensresponse")
    public ResponseEntity<List<ExamenResponse>> getExamensRes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String horaire,
            @RequestParam Long sessionId) {
        try {
            List<ExamenResponse> examens = surveillanceService.getExamensByDateAndHoraireres(date, horaire, sessionId);
            return ResponseEntity.ok(examens);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/assign")
    public ResponseEntity<SurveillanceAssignation> assignSurveillant(@RequestBody Map<String, Object> request) {
        try {
            // Vérification des champs obligatoires
            String[] requiredFields = {"enseignantId", "typeSurveillant", "date", "horaire", "sessionId"};
            for (String field : requiredFields) {
                if (!request.containsKey(field) || request.get(field) == null) {
                    return ResponseEntity.badRequest().build();
                }
            }

            Long enseignantId = Long.valueOf(request.get("enseignantId").toString());
            String typeSurveillant = request.get("typeSurveillant").toString();
            String horaire = request.get("horaire").toString();
            LocalDate date = LocalDate.parse(request.get("date").toString());
            Long sessionId = Long.valueOf(request.get("sessionId").toString());

            // Créer l'assignation
            SurveillanceAssignation assignation = new SurveillanceAssignation();
            assignation.setEnseignant(enseignantId);
            assignation.setTypeSurveillant(typeSurveillant);
            assignation.setDate(date);
            assignation.setHoraire(horaire);

            // Récupérer et définir la session
            Session session = sessionService.getSessionById(sessionId);
            assignation.setSession(session);

            if ("TT".equals(typeSurveillant) || "RR".equals(typeSurveillant)) {
                // Pour TT/RR, pas d'examen ni de local
                assignation.setExamen(null);
                assignation.setLocal(null);
            } else {
                // Pour une surveillance normale, vérifier la présence des champs supplémentaires
                if (!request.containsKey("examenId") || !request.containsKey("localId")) {
                    return ResponseEntity.badRequest().build();
                }

                Long examenId = Long.valueOf(request.get("examenId").toString());
                Long localId = Long.valueOf(request.get("localId").toString());

                Examen examen = examenService.getExamenById(examenId);
                assignation.setExamen(examen);
                assignation.setLocal(localId);
            }

            SurveillanceAssignation savedAssignation = surveillanceService.assignSurveillant(assignation);
            return ResponseEntity.ok(savedAssignation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();  // Retourne directement un bad request au lieu de tenter de caster
        }
    }

    @GetMapping("/assignments")
    public ResponseEntity<?> getSurveillanceAssignments(
            @RequestParam("sessionId") Long sessionId) {
        try {
            List<SurveillanceAssignation> assignments = surveillanceService.getAssignmentsBySession(sessionId);
            List<Map<String, Object>> response = assignments.stream()
                    .map(sa -> {
                        Map<String, Object> assignmentMap = new HashMap<>();
                        assignmentMap.put("id", sa.getId());
                        assignmentMap.put("enseignantId", sa.getEnseignant());
                        assignmentMap.put("typeSurveillant", sa.getTypeSurveillant());
                        assignmentMap.put("date", sa.getDate());
                        assignmentMap.put("horaire", sa.getHoraire());

                        if ("TT".equals(sa.getTypeSurveillant()) || "RR".equals(sa.getTypeSurveillant())) {
                            assignmentMap.put("localId", null);
                            assignmentMap.put("examenId", null);
                        } else {
                            assignmentMap.put("localId", sa.getLocal());
                            assignmentMap.put("examenId", sa.getExamen().getId());
                        }

                        return assignmentMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Failed to get assignments"));
        }
    }

    @PostMapping
    public ResponseEntity<SurveillanceAssignation> createSurveillanceAssignation(@RequestBody SurveillanceAssignation surveillanceAssignation) {
        SurveillanceAssignation createdSurveillanceAssignation = surveillanceAssignationService.assignSurveillant(surveillanceAssignation);
        return ResponseEntity.ok(createdSurveillanceAssignation);
    }
}


