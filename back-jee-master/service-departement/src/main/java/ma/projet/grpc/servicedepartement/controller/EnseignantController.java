package ma.projet.grpc.servicedepartement.controller;

import jakarta.validation.Valid;
import ma.projet.grpc.servicedepartement.entity.Enseignant;
import ma.projet.grpc.servicedepartement.service.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;

    @Autowired
    public EnseignantController(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
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
}
