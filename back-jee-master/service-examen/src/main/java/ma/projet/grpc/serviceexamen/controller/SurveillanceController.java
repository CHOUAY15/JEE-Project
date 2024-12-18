package ma.projet.grpc.serviceexamen.controller;

import io.micrometer.common.util.StringUtils;
import jakarta.persistence.EntityNotFoundException;
import ma.projet.grpc.serviceexamen.dto.AssignSurveillantRequest;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.SurveillanceAssignation;
import ma.projet.grpc.serviceexamen.repository.SurveillanceAssignationRepository;
import ma.projet.grpc.serviceexamen.service.ExamenService;
import ma.projet.grpc.serviceexamen.service.SurveillanceService;
import ma.projet.grpc.serviceexamen.service.impl.SurveillanceServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/surveillance")
public class SurveillanceController {

    @Autowired
    private SurveillanceAssignationRepository surveillanceAssignationRepository;

    @Autowired
    private SurveillanceService surveillanceService;

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
    @PostMapping("/assign")
    public ResponseEntity<SurveillanceAssignation> assignSurveillant(@RequestBody AssignSurveillantRequest request) {
        // Validation des paramètres obligatoires
        System.out.println("adam: " + request.toString());
        System.out.println("ExamenId: " + request.getExamenId());
        System.out.println("Enseignant: " + request.getEnseignantId());
        System.out.println("Local: " + request.getLocalId());
        System.out.println("TypeSurveillant: " + request.getTypeSurveillant());

        if (request.getExamenId() == null ||
                request.getEnseignantId() == null ||
                request.getLocalId() == null ||
                StringUtils.isEmpty(request.getTypeSurveillant())) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // Récupérer l'Examen par ID
            Examen examen = examenService.getExamenById(request.getExamenId());

            // Créer l'entité SurveillanceAssignation
            SurveillanceAssignation assignation = new SurveillanceAssignation();
            assignation.setExamen(examen);
            assignation.setEnseignant(request.getEnseignantId());
            assignation.setLocal(request.getLocalId());
            assignation.setTypeSurveillant(request.getTypeSurveillant());

            // Vérifier les contraintes métier avant la sauvegarde
            // Par exemple, vérifier la disponibilité de l'enseignant, du local, etc.

            // Appeler le service pour sauvegarder la surveillance
            SurveillanceAssignation savedAssignation = surveillanceAssignationService.assignSurveillant(assignation);

            // Retourner la réponse avec l'objet créé
            return ResponseEntity.ok(savedAssignation);
        } catch (EntityNotFoundException e) {
            // Gestion si l'examen n'est pas trouvé
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Gestion des autres exceptions
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping
    public ResponseEntity<SurveillanceAssignation> createSurveillanceAssignation(@RequestBody SurveillanceAssignation surveillanceAssignation) {
        SurveillanceAssignation createdSurveillanceAssignation = surveillanceAssignationService.assignSurveillant(surveillanceAssignation);
        return ResponseEntity.ok(createdSurveillanceAssignation);
    }
}


