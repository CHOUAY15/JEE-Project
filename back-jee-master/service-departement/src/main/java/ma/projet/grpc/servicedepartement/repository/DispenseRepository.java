package ma.projet.grpc.servicedepartement.repository;

import ma.projet.grpc.servicedepartement.entity.Dispense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DispenseRepository extends JpaRepository<Dispense, Long> {
    List<Dispense> findByEnseignantId(Long enseignantId);
    List<Dispense> findByDateDebutLessThanEqualAndDateFinGreaterThanEqual(String dateDebut, String dateFin);
    boolean existsByEnseignantIdAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(Long enseignantId, String dateDebut, String dateFin);
    Optional<Dispense> findByIdAndEnseignantId(Long dispenseId, Long enseignantId);
}
