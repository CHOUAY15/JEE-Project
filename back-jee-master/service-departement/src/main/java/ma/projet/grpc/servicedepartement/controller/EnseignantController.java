package ma.projet.grpc.servicedepartement.controller;

import jakarta.validation.Valid;
import ma.projet.grpc.servicedepartement.entity.Dispense;
import ma.projet.grpc.servicedepartement.entity.Enseignant;
import ma.projet.grpc.servicedepartement.service.DispenseService;
import ma.projet.grpc.servicedepartement.service.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;
    private final DispenseService dispenseService;


    @Autowired
    public EnseignantController(EnseignantService enseignantService, DispenseService dispenseService) {
        this.enseignantService = enseignantService;
        this.dispenseService = dispenseService;
    }
    @GetMapping
    public ResponseEntity<List<Enseignant>> getAllEnseignants() {
        return ResponseEntity.ok(enseignantService.getAllEnseignants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getEnseignantById(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getEnseignantById(id));
    }

    @PostMapping
    public ResponseEntity<Enseignant> createEnseignant(@Valid @RequestBody Enseignant enseignant) {
        return new ResponseEntity<>(enseignantService.createEnseignant(enseignant), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enseignant> updateEnseignant(
            @PathVariable Long id,
            @Valid @RequestBody Enseignant enseignant) {
        return ResponseEntity.ok(enseignantService.updateEnseignant(id, enseignant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        enseignantService.deleteEnseignant(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/percentages")
    public Map<String, Double> getEnseignantPercentages() {
        return enseignantService.getPercentageDispenses();
    }
    @GetMapping("/disponibles")
    public ResponseEntity<List<Enseignant>> getEnseignantsDisponibles() {
        List<Enseignant> enseignantsDisponibles = enseignantService.getEnseignantsDisponibles();
        return ResponseEntity.ok(enseignantsDisponibles);  // Retourne la liste des enseignants disponibles
    }
    @GetMapping("/nom/{nom}")
    public ResponseEntity<Enseignant> getEnseignantByNom(@PathVariable String nom) {
        Enseignant enseignant = enseignantService.getEnseignantByNom(nom);
        if (enseignant != null) {
            return ResponseEntity.ok(enseignant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/enseignants/{enseignantId}/dispenses")
    public ResponseEntity<List<Dispense>> getDispensesEnseignant(@PathVariable Long enseignantId) {
        List<Dispense> dispenses = dispenseService.getDispensesByEnseignantId(enseignantId);
        return ResponseEntity.ok(dispenses);
    }

    @PostMapping("/enseignants/{enseignantId}/dispenses")
    public ResponseEntity<Dispense> createDispense(
            @PathVariable Long enseignantId,
            @Valid @RequestBody Dispense dispense) {
        try {
            // Logs détaillés avant le traitement
            System.out.println("\n===========================================");
            System.out.println("DÉBUT DE LA CRÉATION DE DISPENSE");
            System.out.println("===========================================");
            System.out.println("ID Enseignant: " + enseignantId);
            System.out.println("\nCONTENU DE LA REQUÊTE:");
            System.out.println("Cause: " + dispense.getCause());
            System.out.println("Date Début: " + dispense.getDateDebut());
            System.out.println("Date Fin: " + dispense.getDateFin());
            System.out.println("Enseignant dans l'objet: " + dispense.getEnseignant());
            System.out.println("\nVALIDATION DES CHAMPS:");
            System.out.println("Cause est null? " + (dispense.getCause() == null));
            System.out.println("DateDebut est null? " + (dispense.getDateDebut() == null));
            System.out.println("DateFin est null? " + (dispense.getDateFin() == null));
            if (dispense.getEnseignant() != null) {
                System.out.println("ID de l'enseignant dans l'objet: " + dispense.getEnseignant().getId());
            }

            // Tentative de sauvegarde
            System.out.println("\nTENTATIVE DE SAUVEGARDE...");
            Dispense savedDispense = dispenseService.createDispense(enseignantId, dispense);

            // Log du résultat
            System.out.println("\nRÉSULTAT DE LA SAUVEGARDE:");
            System.out.println("ID généré: " + savedDispense.getId());
            System.out.println("===========================================\n");

            return new ResponseEntity<>(savedDispense, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("\nERREUR LORS DE LA CRÉATION:");
            System.out.println("Type d'erreur: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());
            System.out.println("Stack trace:");
            e.printStackTrace();
            System.out.println("===========================================\n");
            throw e;
        }
    }


    @PutMapping("/enseignants/{enseignantId}/dispenses/{dispenseId}")
    public ResponseEntity<Dispense> updateDispense(
            @PathVariable Long enseignantId,
            @PathVariable Long dispenseId,
            @Valid @RequestBody Dispense dispense) {
        return ResponseEntity.ok(dispenseService.updateDispense(enseignantId, dispenseId, dispense));
    }

    @DeleteMapping("/enseignants/{enseignantId}/dispenses/{dispenseId}")
    public ResponseEntity<Void> deleteDispense(
            @PathVariable Long enseignantId,
            @PathVariable Long dispenseId) {
        dispenseService.deleteDispense(enseignantId, dispenseId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint pour vérifier si un enseignant est dispensé à une date donnée
    @GetMapping("/enseignants/{enseignantId}/dispenses/check")
    public ResponseEntity<Boolean> isEnseignantDispense(
            @PathVariable Long enseignantId,
            @RequestParam String date) {
        boolean isDispense = dispenseService.isEnseignantDispenseAtDate(enseignantId, date);
        return ResponseEntity.ok(isDispense);
    }

    // Endpoint pour obtenir les dispenses actives à une date donnée
    @GetMapping("/dispenses/active")
    public ResponseEntity<List<Dispense>> getActiveDispenses(@RequestParam String date) {
        List<Dispense> activeDispenses = dispenseService.getActiveDispenses(date);
        return ResponseEntity.ok(activeDispenses);
    }
}
