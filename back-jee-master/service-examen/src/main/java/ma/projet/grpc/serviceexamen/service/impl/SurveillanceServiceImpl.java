package ma.projet.grpc.serviceexamen.service.impl;

import jakarta.transaction.Transactional;




import ma.projet.grpc.serviceexamen.dto.Enseignant;
import ma.projet.grpc.serviceexamen.dto.ExamenResponse;
import ma.projet.grpc.serviceexamen.dto.Local;
import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.entity.Module;

import ma.projet.grpc.serviceexamen.entity.Option;
import ma.projet.grpc.serviceexamen.entity.Session;
import ma.projet.grpc.serviceexamen.entity.SurveillanceAssignation;
import ma.projet.grpc.serviceexamen.feignClients.EnseignantClient;
import ma.projet.grpc.serviceexamen.feignClients.LocalClient;
import ma.projet.grpc.serviceexamen.repository.ExamenRepository;
import ma.projet.grpc.serviceexamen.repository.ModuleRepository;
import ma.projet.grpc.serviceexamen.repository.SessionRepository;
import ma.projet.grpc.serviceexamen.repository.SurveillanceAssignationRepository;
import ma.projet.grpc.serviceexamen.service.SurveillanceService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class SurveillanceServiceImpl implements SurveillanceService {

    @Autowired
    private ExamenRepository examenRepository;


    @Autowired
    private ModuleRepository moduleRepository;


    @Autowired
    private EnseignantClient enseignantClient;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private SurveillanceAssignationRepository surveillanceAssignationRepository;

    @Autowired
    private LocalClient localClient;



    @Override
    public List<ExamenResponse> getExamensByDateAndHoraireres(LocalDate date, String horaire, Long sessionId) {
        List<Examen> examens = examenRepository.findBySessionIdAndDateAndHoraire(sessionId, date, horaire);

        // Convertir les examens en ExamenResponse avec les informations d'option
        return examens.stream()
                .map(examen -> {
                    ExamenResponse response = new ExamenResponse();
                    response.setId(examen.getId());
                    response.setModule(examen.getModule());
                    response.setDate(examen.getDate());
                    response.setHoraire(examen.getHoraire());
                    response.setLocaux(examen.getLocaux());

                    // Récupérer le module et son option
                    try {
                        Optional<ma.projet.grpc.serviceexamen.entity.Module> moduleOpt = moduleRepository.findByNom(examen.getModule());
                        if (moduleOpt.isPresent()) {
                            Module module = moduleOpt.get();
                            Option option = module.getOption();
                            response.setOptionId(option.getId());
                            response.setOptionName(option.getNomOption());
                        }
                    } catch (Exception e) {
                        // Log l'erreur mais continuer le traitement
                        System.err.println("Erreur lors de la récupération de l'option pour le module: " + examen.getModule());
                        e.printStackTrace();
                    }

                    return response;
                })
                .collect(Collectors.toList());
    }
    @Override
    public List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        LocalDate currentDate = session.getDateDebut();
        LocalDate endDate = session.getDateFin();

        List<Map<String, Object>> emploi = new ArrayList<>();

        while (!currentDate.isAfter(endDate)) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", currentDate);

            Map<String, List<Map<String, Object>>> horaires = new HashMap<>();
            String[] slots = {"start1-end1", "start2-end2", "start3-end3", "start4-end4"};

            for (String slot : slots) {
                List<Examen> examens = examenRepository.findByDateAndHoraireAndSessionAndDepartement(
                        currentDate, slot, sessionId, departementId);

                List<Local> disponible=localClient.getLocauxDisponibles();
                List<Integer> locauxAssignesIds = surveillanceAssignationRepository
                        .findByExamenDateAndExamenHoraire(currentDate, Arrays.toString(slots))
                        .stream()
                        .map(assignation -> assignation.getLocal().intValue())
                        .collect(Collectors.toList());

              //  List<Local> locauxDisponibles = localRepository.findLocauxDisponibles(currentDate, slot);
                List<Local> locauxRestants = disponible.stream()
                        .filter(local -> !locauxAssignesIds.contains(local.getId()))
                        .collect(Collectors.toList());
                List<Map<String, Object>> slotData = new ArrayList<>();
                for (Examen examen : examens) {
                    Map<String, Object> examenData = new HashMap<>();
                    examenData.put("examen", examen);
                    examenData.put("locauxDisponibles", locauxRestants);
                    slotData.add(examenData);
                }

                horaires.put(slot, slotData);
            }

            dayData.put("horaires", horaires);
            emploi.add(dayData);

            currentDate = currentDate.plusDays(1);
        }

        return emploi;
    }

    @Override
    public List<Examen> getExamensByDateAndHoraire(LocalDate date, String horaire, Long sessionId) {
        return examenRepository.findBySessionIdAndDateAndHoraire(sessionId, date, horaire);
    }

    @Override
    @Transactional
    public boolean assignerSurveillant(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        // Validation des paramètres
        Examen examen = examenRepository.findById(examenId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        Enseignant enseignant =enseignantClient.getEnseignantById(enseignantId);

        Local local =localClient.getLocauxById(localId);

        // Vérification des contraintes
        if (!verifierContraintesSurveillance(examenId, enseignantId, localId, typeSurveillant)) {
            throw new RuntimeException("Impossible d'assigner le surveillant. Contraintes non respectées.");
        }

        // Créer l'assignation de surveillance

        SurveillanceAssignation assignation = new SurveillanceAssignation();
        assignation.setExamen(examen);
        assignation.setEnseignant(enseignantId);
        assignation.setLocal(localId);
        assignation.setTypeSurveillant(typeSurveillant);

        // Sauvegarder l'assignation
        surveillanceAssignationRepository.save(assignation);

        return true;
    }

    @Override
    public boolean verifierContraintesSurveillance(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        Examen examen = examenRepository.findById(examenId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        // Remove the check for existing assignment to the same exam
        // This allows multiple surveillants for the same exam

        // Vérifier la disponibilité de l'enseignant pour la date et la période
        LocalDate dateExamen = examen.getDate();
        String periode = getperiodeFromHoraire(examen.getHoraire());

        if (surveillanceAssignationRepository.existsByEnseignantAndDateAndPeriode(enseignantId, dateExamen, periode)) {
            throw new RuntimeException("L'enseignant est déjà assigné à un autre examen durant cette période");
        }

        // Vérifier le nombre maximum de surveillants par examen
        int nombreSurveillants = surveillanceAssignationRepository.countByExamen(examenId);
        int nombreSurveillantsRequis = getNombreSurveillantRequis(examen.getNbEtudiants());

        if (nombreSurveillants >= nombreSurveillantsRequis) {
            throw new RuntimeException("Nombre maximum de surveillants atteint pour cet examen");
        }

        // Vérifier la limite des réservistes
        if (typeSurveillant.equals("RESERVISTE")) {
            int nombreReservistes = surveillanceAssignationRepository.countReservistesForDateAndPeriode(dateExamen, periode);
            if (nombreReservistes >= 2) { // Limite de 2 réservistes par période
                throw new RuntimeException("Nombre maximum de réservistes atteint pour cette période");
            }
        }

        return true;
    }
    @Override
    public int getNombreSurveillantRequis(int nbEtudiants) {
        // Logique de calcul du nombre de surveillants requis
        if (nbEtudiants <= 30) return 1;
        if (nbEtudiants <= 60) return 2;
        return 3;
    }

    private String getperiodeFromHoraire(String horaire) {
        // Déterminer la période (MATIN ou APRES-MIDI) en fonction de l'horaire
        if (horaire.equals("start1-end1") || horaire.equals("start2-end2")) {
            return "MATIN";
        }
        return "APRES-MIDI";
    }
    @Override
    public List<Enseignant> getEnseignantsDisponibles(Long departementId, LocalDate date, String periode) {
        System.out.println("Departement ID: " + departementId);
        System.out.println("Date: " + date);
        System.out.println("Période: " + periode);
        List<Enseignant> enseignantsDisponibles = enseignantClient.getEnseignantsDisponibles();

        // Récupérer les enseignants déjà assignés en fonction de la période (matin/après-midi)
        List<Long> enseignantsAssignesIds = surveillanceAssignationRepository.findAssignedEnseignantsByPeriode(date, periode);
        System.out.println("liste"+enseignantsAssignesIds);


        // Filtrer les enseignants disponibles en excluant ceux déjà assignés
        List<Enseignant> enseignantsRestants = enseignantsDisponibles.stream()
                .filter(enseignant -> !enseignantsAssignesIds.contains(enseignant.getId()))
                .collect(Collectors.toList());

        return enseignantsRestants;
    }



    @Override
    public List<Local> getLocauxDisponibles(LocalDate date, String horaire) {
        List<Local> disponible=localClient.getLocauxDisponibles();
        LocalDate Date=date;
        List<Integer> locauxAssignesIds = surveillanceAssignationRepository
                .findByExamenDateAndExamenHoraire(Date, horaire)
                .stream()
                .map(assignation -> assignation.getLocal().intValue())
                .collect(Collectors.toList());

        //  List<Local> locauxDisponibles = localRepository.findLocauxDisponibles(currentDate, slot);
        List<Local> locauxRestants = disponible.stream()
                .filter(local -> !locauxAssignesIds.contains(local.getId()))
                .collect(Collectors.toList());
        return locauxRestants;


       // return localRepository.findLocauxDisponibles(date, horaire);
    }



    private String getPeriodeFromHoraire(String horaire) {
        return horaire.startsWith("start1") || horaire.startsWith("start2") ? "MATIN" : "APRES_MIDI";
    }



    @Override
    public List<SurveillanceAssignation> getAssignmentsBySession(Long sessionId) {
        return surveillanceAssignationRepository.findBySessionId(sessionId);
    }

    @Override
    @Transactional  // Important pour la suppression
    public void deleteById(Long id) {
        // Vérifier si l'assignation existe
        if (surveillanceAssignationRepository.existsById(id)) {
            surveillanceAssignationRepository.deleteById(id);
        } else {
            throw new RuntimeException("Surveillance assignment not found with id: " + id);
        }
    }

    @Override
    public SurveillanceAssignation assignSurveillant(SurveillanceAssignation assignation) {
        return surveillanceAssignationRepository.save(assignation);
    }
}

