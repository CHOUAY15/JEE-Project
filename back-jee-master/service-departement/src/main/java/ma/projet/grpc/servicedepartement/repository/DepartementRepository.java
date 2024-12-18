package ma.projet.grpc.servicedepartement.repository;
import ma.projet.grpc.servicedepartement.entity.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface DepartementRepository extends JpaRepository<Departement, Long> {
    public Optional<Departement> findByNom(String nom);
}