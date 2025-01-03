package ma.projet.grpc.serviceexamen.optaplanner.score;

import ma.projet.grpc.serviceexamen.dto.Local;
import ma.projet.grpc.serviceexamen.optaplanner.domain.SurveillanceAssignationPlanning;

import ma.projet.grpc.serviceexamen.feignClients.LocalClient;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static org.optaplanner.core.api.score.stream.ConstraintCollectors.count;

@Component
public class SurveillanceConstraintProvider implements ConstraintProvider {

    @Autowired
    private LocalClient localClient;

    @Override
    public Constraint[] defineConstraints(ConstraintFactory factory) {
        return new Constraint[] {
                maxDeuxSeancesParJour(factory),
                equitableDistributionRR(factory),
                respecterCapaciteLocaux(factory),
                dixReservistesParPeriode(factory)
        };
    }

    private Constraint maxDeuxSeancesParJour(ConstraintFactory factory) {
        return factory.forEach(SurveillanceAssignationPlanning.class)
                .groupBy(SurveillanceAssignationPlanning::getEnseignant,
                        SurveillanceAssignationPlanning::getDate,
                        count())
                .filter((enseignant, date, count) -> count > 2)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Max 2 séances par jour");
    }

    private Constraint equitableDistributionRR(ConstraintFactory factory) {
        return factory.forEach(SurveillanceAssignationPlanning.class)
                .filter(a -> "RR".equals(a.getTypeSurveillant()))
                .groupBy(SurveillanceAssignationPlanning::getEnseignant, count())
                .filter((enseignant, count) -> count > 0)
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Distribution équitable RR");
    }

    private Constraint dixReservistesParPeriode(ConstraintFactory factory) {
        return factory.forEach(SurveillanceAssignationPlanning.class)
                .filter(a -> "RR".equals(a.getTypeSurveillant()))
                .groupBy(SurveillanceAssignationPlanning::getDate,
                        SurveillanceAssignationPlanning::getHoraire,
                        count())
                .filter((date, horaire, count) -> count > 10)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Max 10 réservistes par période");
    }

    private Constraint respecterCapaciteLocaux(ConstraintFactory factory) {
        return factory.forEach(SurveillanceAssignationPlanning.class)
                .filter(a -> a.getLocal() != null)
                .groupBy(
                        SurveillanceAssignationPlanning::getLocal,
                        SurveillanceAssignationPlanning::getDate,
                        SurveillanceAssignationPlanning::getHoraire,
                        count()
                )
                .filter((local, date, horaire, count) -> {
                    Local localInfo = localClient.getLocauxById(local);
                    int maxSurveillants = "amphi".equals(localInfo.getType()) ? 3 : 2;
                    return count > maxSurveillants;
                })
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Respect capacité locaux");
    }
}