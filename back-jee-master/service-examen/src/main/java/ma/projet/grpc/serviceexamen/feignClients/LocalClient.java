package ma.projet.grpc.serviceexamen.feignClients;



import ma.projet.grpc.serviceexamen.dto.Local;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "SERVICE-DEPARTEMENT-LOCAL", url = "http://localhost:8888/SERVICE-DEPARTEMENT")
public interface LocalClient {

    @GetMapping("/locaux/{id}")
    Local getLocauxById(@PathVariable("id") Long id);

    @GetMapping("/locaux/disponibles")
    List<Local> getLocauxDisponibles();
}
