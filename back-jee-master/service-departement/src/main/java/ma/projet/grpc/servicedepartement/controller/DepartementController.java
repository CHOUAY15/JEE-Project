package ma.projet.grpc.servicedepartement.controller;

import jakarta.validation.Valid;
import ma.projet.grpc.servicedepartement.entity.Departement;
import ma.projet.grpc.servicedepartement.entity.Enseignant;
import ma.projet.grpc.servicedepartement.service.DepartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/departements")
public class DepartementController {
    private final DepartementService departementService;

    @Autowired
    public DepartementController(DepartementService departementService) {
        this.departementService = departementService;
    }

    @GetMapping
    public ResponseEntity<List<Departement>> getAllDepartements() {
        return ResponseEntity.ok(departementService.getAllDepartements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departement> getDepartementById(@PathVariable Long id) {
        return ResponseEntity.ok(departementService.getDepartementById(id));
    }

    @GetMapping("/{id}/enseignants")
    public ResponseEntity<List<Enseignant>> getEnseignantsByDepartementId(@PathVariable Long id) {
        return ResponseEntity.ok(departementService.getEnseignantsByDepartementId(id));
    }

    @PostMapping
    public ResponseEntity<Departement> createDepartement(@Valid @RequestBody Departement departement) {
        return new ResponseEntity<>(departementService.createDepartement(departement), HttpStatus.CREATED);
    }

    // Nouvel endpoint pour ajouter un enseignant à un département
    @PostMapping("/{departementId}/enseignants")
    public ResponseEntity<Enseignant> addEnseignantToDepartement(
            @PathVariable Long departementId,
            @Valid @RequestBody Enseignant enseignant) {
        Enseignant addedEnseignant = departementService.addEnseignantToDepartement(departementId, enseignant);
        return new ResponseEntity<>(addedEnseignant, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departement> updateDepartement(@PathVariable Long id,
                                                         @Valid @RequestBody Departement departement) {
        return ResponseEntity.ok(departementService.updateDepartement(id, departement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartement(@PathVariable Long id) {
        departementService.deleteDepartement(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/enseignants-par-departement")
    public Map<String, Integer> getNombreEnseignantsParDepartement() {
        return departementService.getNombreEnseignantsParDepartement();
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
        try {
            departementService.saveDepartementsFromCsv(file);
            return ResponseEntity.ok("Départements ajoutés avec succès depuis le fichier CSV.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de la lecture du fichier CSV.");
        }
    }


}
