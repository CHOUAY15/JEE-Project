package ma.projet.grpc.serviceexamen.config;

import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.constructionheuristic.ConstructionHeuristicPhaseConfig;
import org.optaplanner.core.config.constructionheuristic.ConstructionHeuristicType;
import org.optaplanner.core.config.localsearch.LocalSearchPhaseConfig;
import org.optaplanner.core.config.localsearch.LocalSearchType;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ma.projet.grpc.serviceexamen.optaplanner.domain.SurveillanceSchedule;
import ma.projet.grpc.serviceexamen.optaplanner.domain.SurveillanceAssignationPlanning;
import ma.projet.grpc.serviceexamen.optaplanner.score.SurveillanceConstraintProvider;

@Configuration
public class OptaPlannerConfig {
    @Bean
    public SolverFactory<SurveillanceSchedule> solverFactory() {
        SolverConfig solverConfig = new SolverConfig()
                .withSolutionClass(SurveillanceSchedule.class)
                .withEntityClasses(SurveillanceAssignationPlanning.class)
                .withConstraintProviderClass(SurveillanceConstraintProvider.class)
                .withTerminationConfig(new TerminationConfig()
                        .withSecondsSpentLimit(30L))
                .withPhases(
                        new ConstructionHeuristicPhaseConfig()
                                .withConstructionHeuristicType(
                                        ConstructionHeuristicType.FIRST_FIT_DECREASING),
                        new LocalSearchPhaseConfig()
                                .withLocalSearchType(LocalSearchType.LATE_ACCEPTANCE)
                );

        return SolverFactory.create(solverConfig);
    }
}