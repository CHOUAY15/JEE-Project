package ma.projet.grpc.serviceexamen.service.impl;
import java.util.stream.Collectors;


import ma.projet.grpc.serviceexamen.entity.Examen;
import ma.projet.grpc.serviceexamen.feignClients.LocalClient;
import ma.projet.grpc.serviceexamen.repository.ExamenRepository;
import ma.projet.grpc.serviceexamen.service.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class ExamenServiceImpl implements ExamenService {

    private final ExamenRepository examenRepository;
    private LocalClient localClient;


    @Autowired
    public ExamenServiceImpl(ExamenRepository examenRepository) {
        this.examenRepository = examenRepository;

    }

    @Override
    public List<Examen> getExamensBySessionDateHoraire(Long sessionId, LocalDate date, String horaire) {
        return examenRepository.findBySessionIdAndDateAndHoraire(sessionId, date, horaire);
    }

    @Override
    public Examen createExamen(Examen examen) {
        // Si les IDs des locaux sont fournis, vous n'avez pas besoin de mapper les entités Local ici
        if (examen.getLocaux() != null && !examen.getLocaux().isEmpty()) {
            // Assurez-vous simplement que les IDs des locaux sont des Long
            Set<Long> locauxIds = examen.getLocaux().stream()
                    .map(Long::valueOf) // Convertir les IDs en Long si nécessaire
                    .collect(Collectors.toSet());
            examen.setLocaux(locauxIds); // Assigner directement les IDs
        }
        return examenRepository.save(examen);
    }


    @Override
    public List<Examen> getAllExamens() {
        return examenRepository.findAll();
    }

    @Override
    public Examen updateExamen(Long id, Examen examen) {
        Examen existingExamen = examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'id: " + id));

        // Mettre à jour les champs
        existingExamen.setSession(examen.getSession());
        existingExamen.setDepartementId(examen.getDepartementId());
        existingExamen.setEnseignantId(examen.getEnseignantId());

        // Mettre à jour les IDs des locaux (pas les entités Local)
        if (examen.getLocaux() != null && !examen.getLocaux().isEmpty()) {
            Set<Long> locauxIds = examen.getLocaux().stream()
                    .map(Long::valueOf) // Convertir les IDs en Long si nécessaire
                    .collect(Collectors.toSet());
            existingExamen.setLocaux(locauxIds); // Mettre à jour avec les IDs des locaux
        }

        existingExamen.setModule(examen.getModule());
        existingExamen.setDate(examen.getDate());
        existingExamen.setHoraire(examen.getHoraire());
        existingExamen.setNbEtudiants(examen.getNbEtudiants());

        return examenRepository.save(existingExamen);
    }


    @Override
    public void deleteExamen(Long id) {
        if (!examenRepository.existsById(id)) {
            throw new RuntimeException("Examen non trouvé avec l'id: " + id);
        }
        examenRepository.deleteById(id);
    }

    public Examen getExamenById(Long id) {
        return examenRepository.findById(id).orElseThrow(() -> new RuntimeException("Examen non trouvé"));
    }
}
