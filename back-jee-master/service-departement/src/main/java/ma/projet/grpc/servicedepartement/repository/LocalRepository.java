package ma.projet.grpc.servicedepartement.repository;
import ma.projet.grpc.servicedepartement.entity.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LocalRepository extends JpaRepository<Local, Long> {

    @Query("SELECT l FROM Local l WHERE l.estDisponible = true")
    List<Local> findDisponibles();
    /*@Query("SELECT l FROM Local l WHERE l.estDisponible = true " +
            "AND l.id NOT IN (SELECT sa.local.id FROM SurveillanceAssignation sa " +
            "WHERE sa.examen.date = :date AND sa.examen.horaire = :horaire)")  */
    @Query("SELECT l FROM Local l WHERE  l.type = :type")
    List<Local> findLocauxDisponibles(LocalDate date, String horaire);
}