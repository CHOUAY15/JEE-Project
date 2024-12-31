package ma.projet.grpc.serviceexamen.optaplanner.domain;

import lombok.Data;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.Session;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

import java.time.LocalDate;

@Data
@PlanningEntity
public class SurveillanceAssignationPlanning {
    private Long id;

    @PlanningVariable(valueRangeProviderRefs = "enseignantRange")
    private Long enseignant;

    private Examen examen;
    private String typeSurveillant;
    private LocalDate date;
    private String horaire;
    private Session session;
    private Long local;

    // getters, setters
}