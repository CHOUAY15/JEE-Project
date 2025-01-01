package ma.projet.grpc.servicedepartement.controller;

import jakarta.validation.Valid;
import ma.projet.grpc.servicedepartement.entity.Local;
import ma.projet.grpc.servicedepartement.service.LocalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/locaux")  // Enlevez /api ici car il est dans context-path
public class LocalController {
    private final LocalService localService;

    @Autowired
    public LocalController(LocalService localService) {
        this.localService = localService;
    }

    @GetMapping
    public ResponseEntity<List<Local>> getAllLocaux() {
        return ResponseEntity.ok(localService.getAllLocaux());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Local> getLocalById(@PathVariable Long id) {
        return ResponseEntity.ok(localService.getLocalById(id));
    }

    @PostMapping
    public ResponseEntity<Local> createLocal(@Valid @RequestBody Local local) {
        return new ResponseEntity<>(localService.createLocal(local), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Local> updateLocal(@PathVariable Long id, @Valid @RequestBody Local local) {
        return ResponseEntity.ok(localService.updateLocal(id, local));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocal(@PathVariable Long id) {
        localService.deleteLocal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disponibles")
    public List<Local> getLocauxDisponibles() {
        return localService.findDisponibles();
    }

    @PostMapping("/saveAll")
    public ResponseEntity<List<Local>> saveAllLocaux(@RequestBody List<Local> locaux) {
        List<Local> savedLocaux = localService.saveAll(locaux);
        return ResponseEntity.ok(savedLocaux);
    }
}
