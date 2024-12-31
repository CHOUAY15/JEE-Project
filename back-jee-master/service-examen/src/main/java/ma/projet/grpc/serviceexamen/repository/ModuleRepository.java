package ma.projet.grpc.serviceexamen.repository;

import ma.projet.grpc.serviceexamen.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    // Dans ModuleRepository.java
    List<Module> findByOptionId(Long optionId);
    Optional<Module> findByNom(String nom);

}
