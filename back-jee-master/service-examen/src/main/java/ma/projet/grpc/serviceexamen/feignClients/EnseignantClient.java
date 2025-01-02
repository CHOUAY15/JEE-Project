package ma.projet.grpc.serviceexamen.feignClients;


import ma.projet.grpc.serviceexamen.dto.Enseignant;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "SERVICE-DEPARTEMENT")  // Le nom du serviceA tel qu'il est enregistré dans Eureka
public interface EnseignantClient {

    @GetMapping("/enseignants")
    List<Enseignant> getAllEnseignants();
    @GetMapping("/enseignants/disponibles")
    List<Enseignant> getEnseignantsDisponibles();
    @GetMapping("/enseignants/{id}")
    Enseignant getEnseignantById(@PathVariable Long id);
}

