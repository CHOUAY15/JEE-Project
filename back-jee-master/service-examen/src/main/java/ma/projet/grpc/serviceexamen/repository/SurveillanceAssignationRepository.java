package ma.projet.grpc.serviceexamen.repository;

import feign.Param;

import ma.projet.grpc.serviceexamen.entity.Session;
import ma.projet.grpc.serviceexamen.entity.SurveillanceAssignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SurveillanceAssignationRepository extends JpaRepository<SurveillanceAssignation, Long> {
    @Query("SELECT COUNT(sa) FROM SurveillanceAssignation sa " +
            "WHERE sa.enseignant = :enseignantId AND sa.examen.date = :date")
    int countByEnseignantAndDate(Long enseignantId, LocalDate date);

    @Query("SELECT COUNT(sa) FROM SurveillanceAssignation sa WHERE sa.examen.id = :examenId")
    int countByExamen(Long examenId);

    List<SurveillanceAssignation> findBySessionId(Long sessionId);

    SurveillanceAssignation findByEnseignantAndExamen_DateAndExamen_Horaire(
            Long enseignantId, LocalDate date, String horaire);

    @Query("SELECT sa FROM SurveillanceAssignation sa WHERE sa.examen.session.id = :sessionId AND sa.examen.date = :date")
    List<SurveillanceAssignation> findBySessionAndDate(@Param("sessionId") Long sessionId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(sa) FROM SurveillanceAssignation sa " +
            "WHERE sa.examen.date = :date " +
            "AND sa.typeSurveillant = 'RESERVISTE' " +
            "AND ((" +
            "(:periode = 'MATIN' AND sa.examen.horaire IN ('start1-end1', 'start2-end2')) " +
            ") OR (" +
            "(:periode != 'MATIN' AND sa.examen.horaire IN ('start3-end3', 'start4-end4'))" +
            "))")
    int countReservistesForDateAndPeriode(LocalDate date, String periode);

    @Query("SELECT CASE WHEN COUNT(sa) > 0 THEN true ELSE false END FROM SurveillanceAssignation sa " +
            "WHERE sa.enseignant = :enseignantId " +
            "AND sa.examen.date = :date " +
            "AND ((" +
            "(:periode = 'MATIN' AND sa.examen.horaire IN ('start1-end1', 'start2-end2')) " +
            ") OR (" +
            "(:periode != 'MATIN' AND sa.examen.horaire IN ('start3-end3', 'start4-end4'))" +
            "))")
    boolean existsByEnseignantAndDateAndPeriode(Long enseignantId, LocalDate date, String periode);
    @Query("SELECT CASE WHEN COUNT(sa) > 0 THEN true ELSE false END FROM SurveillanceAssignation sa " +
            "WHERE sa.enseignant = :enseignantId AND sa.examen.id = :examenId")
    boolean existsByEnseignantAndExamen(Long enseignantId, Long examenId);


    List<SurveillanceAssignation> findByExamenDateAndExamenHoraire(LocalDate date, String horaire);

    @Query("SELECT sa.enseignant FROM SurveillanceAssignation sa " +
            "WHERE sa.examen.date = :date " +
            "AND sa.examen.horaire = :periode")
    List<Long> findAssignedEnseignantsByPeriode(@Param("date") LocalDate date, @Param("periode") String periode);





    @Query("SELECT sa.enseignant FROM SurveillanceAssignation sa " +
            "WHERE sa.examen.date = :date " +
            "AND sa.examen.horaire IN ('start3-end3', 'start4-end4')")
    List<Integer> findAssignedEnseignantsApresMidi(@Param("date") LocalDate date);



    @Query("DELETE FROM SurveillanceAssignation sa WHERE sa.examen.session = :session")
    void deleteAllBySession(@Param("session") Session session);

    List<SurveillanceAssignation> findByExamen_Session_Id(Long sessionId);

}
