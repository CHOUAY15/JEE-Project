package ma.projet.grpc.serviceexamen.controller;

import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.service.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/examens")
public class ExamenController {

    private final ExamenService examenService;

    @Autowired
    public ExamenController(ExamenService examenService) {
        this.examenService = examenService;
    }


    @GetMapping
    public ResponseEntity<List<Examen>> getAllExamens() {
        List<Examen> examens = examenService.getAllExamens();
        return ResponseEntity.ok(examens);
    }

    // Récupérer des examens existants
    @GetMapping("/{sessionId}/{date}/{horaire}")
    public ResponseEntity<List<Examen>> getExamens(
            @PathVariable Long sessionId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String horaire) {
        return ResponseEntity.ok(examenService.getExamensBySessionDateHoraire(sessionId, date, horaire));
    }

    // Créer un examen
    @PostMapping
    public ResponseEntity<Examen> createExamen(@RequestBody Examen examen) {
        Examen createdExamen = examenService.createExamen(examen);
        return ResponseEntity.ok(createdExamen);
    }

    // Mettre à jour un examen
    @PutMapping("/{id}")
    public ResponseEntity<Examen> updateExamen(@PathVariable Long id, @RequestBody Examen examen) {
        Examen updatedExamen = examenService.updateExamen(id, examen);
        return ResponseEntity.ok(updatedExamen);
    }

    // Supprimer un examen
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamen(@PathVariable Long id) {
        examenService.deleteExamen(id);
        return ResponseEntity.noContent().build();
    }
}
