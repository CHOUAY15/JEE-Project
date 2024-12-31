package ma.projet.grpc.serviceexamen.optaplanner.domain;

import lombok.Data;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.Session;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.ProblemFactProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.domain.solution.PlanningScore;

import java.util.List;

@Data
@PlanningSolution
public class SurveillanceSchedule {
    @PlanningEntityCollectionProperty
    private List<SurveillanceAssignationPlanning> surveillances;

    @ValueRangeProvider(id = "enseignantRange")
    private List<Long> availableEnseignants;

    @ProblemFactProperty
    private List<Examen> examens;

    @ProblemFactProperty
    private List<Long> locaux;

    @ProblemFactProperty
    private Session session;

    @PlanningScore
    private HardSoftScore score;

    // Default constructor
    public SurveillanceSchedule() {
        score = HardSoftScore.ZERO;
    }
}