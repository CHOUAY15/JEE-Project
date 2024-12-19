package ma.projet.grpc.serviceexamen.controller;

import ma.projet.grpc.serviceexamen.entity.Option;
import ma.projet.grpc.serviceexamen.service.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/options")
public class OptionController {

    @Autowired
    private OptionService optionService;

    @PostMapping
    public Option createOption(@RequestBody Option option) {
        return optionService.createOption(option);
    }

    @PutMapping("/{id}")
    public Option updateOption(@PathVariable Long id, @RequestBody Option option) {
        return optionService.updateOption(id, option);
    }

    @GetMapping("/{id}")
    public Option getOptionById(@PathVariable Long id) {
        return optionService.getOptionById(id);
    }

    @GetMapping
    public List<Option> getAllOptions() {
        return optionService.getAllOptions();
    }

    @DeleteMapping("/{id}")
    public void deleteOption(@PathVariable Long id) {
        optionService.deleteOption(id);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importOptionsFromJSON(@RequestBody List<Option> options) {
        // Vérifier si la liste est vide
        if (options.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucune donnée à importer");
        }

        try {
            // Valider et enregistrer les options
            for (Option option : options) {
                if (option.getNomOption().isEmpty() || option.getNiveauAnnee().isEmpty()) {
                    return ResponseEntity.badRequest()
                            .body("Le nom de l'option et le niveau d'année ne peuvent pas être vides");
                }
                if (option.getNombreEtudiant() < 0) {
                    return ResponseEntity.badRequest()
                            .body("Le nombre d'étudiants ne peut pas être négatif");
                }
            }

            // Sauvegarder toutes les options
            List<Option> savedOptions = optionService.saveAll(options);

            return ResponseEntity.ok()
                    .body("Import réussi. " + savedOptions.size() + " options importées.");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erreur lors de l'importation: " + e.getMessage());
        }
    }

}

