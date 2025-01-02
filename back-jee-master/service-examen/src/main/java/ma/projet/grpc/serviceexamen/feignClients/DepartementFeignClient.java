package ma.projet.grpc.serviceexamen.feignClients;


import ma.projet.grpc.serviceexamen.dto.Departement;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "service-departement")  // Remplacez par l'URL de votre service Departement
public interface DepartementFeignClient {

    @GetMapping("/departements/{id}")
    Departement getDepartementById(@PathVariable("id") Long id);
}

