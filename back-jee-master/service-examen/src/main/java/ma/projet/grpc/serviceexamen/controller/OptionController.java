package ma.projet.grpc.serviceexamen.controller;

import ma.projet.grpc.serviceexamen.entity.Option;
import ma.projet.grpc.serviceexamen.service.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<Option>> saveAllOptions(@RequestBody List<Option> options) {
        List<Option> savedOptions = optionService.saveAllOptions(options);
        return ResponseEntity.ok(savedOptions);
    }
}
