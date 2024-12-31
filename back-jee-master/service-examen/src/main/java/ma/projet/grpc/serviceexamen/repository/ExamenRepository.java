package ma.projet.grpc.serviceexamen.repository;

import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {
    // Requête dérivée correcte
    List<Examen> findBySessionIdAndDateAndHoraire(Long sessionId, LocalDate date, String horaire);

    List<Examen> findBySessionId(Long sessionId);

    // Requête personnalisée avec @Query
    @Query("SELECT e FROM Examen e WHERE e.date = :date AND e.horaire = :horaire " +
            "AND e.session.id = :sessionId AND e.departementId = :departementId")
    List<Examen> findByDateAndHoraireAndSessionAndDepartement(
            LocalDate date, String horaire, Long sessionId, Long departementId);

    // Compter les examens par session
    long countBySession(Session session);
}
