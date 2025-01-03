package ma.projet.grpc.servicedepartement.service.impl;

import ma.projet.grpc.servicedepartement.entity.Dispense;
import ma.projet.grpc.servicedepartement.entity.Enseignant;
import ma.projet.grpc.servicedepartement.repository.DispenseRepository;
import ma.projet.grpc.servicedepartement.repository.EnseignantRepository;
import ma.projet.grpc.servicedepartement.service.DispenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DispenseServiceImpl implements DispenseService {
    private final DispenseRepository dispenseRepository;
    private final EnseignantRepository enseignantRepository;

    @Autowired
    public DispenseServiceImpl(DispenseRepository dispenseRepository, EnseignantRepository enseignantRepository) {
        this.dispenseRepository = dispenseRepository;
        this.enseignantRepository = enseignantRepository;
    }

    @Override
    public List<Dispense> getDispensesByEnseignantId(Long enseignantId) {
        return dispenseRepository.findByEnseignantId(enseignantId);
    }

    @Override
    public Dispense createDispense(Long enseignantId, Dispense dispense) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable avec l'ID " + enseignantId));
        dispense.setEnseignant(enseignant);
        return dispenseRepository.save(dispense);
    }

    @Override
    public Dispense updateDispense(Long enseignantId, Long dispenseId, Dispense dispense) {
        Dispense existingDispense = dispenseRepository.findByIdAndEnseignantId(dispenseId, enseignantId)
                .orElseThrow(() -> new RuntimeException("Dispense introuvable pour l'enseignant avec l'ID " + enseignantId));
        existingDispense.setCause(dispense.getCause());
        existingDispense.setDateDebut(dispense.getDateDebut());
        existingDispense.setDateFin(dispense.getDateFin());
        return dispenseRepository.save(existingDispense);
    }

    @Override
    public void deleteDispense(Long enseignantId, Long dispenseId) {
        Dispense dispense = dispenseRepository.findByIdAndEnseignantId(dispenseId, enseignantId)
                .orElseThrow(() -> new RuntimeException("Dispense introuvable pour l'enseignant avec l'ID " + enseignantId));
        dispenseRepository.delete(dispense);
    }

    @Override
    public boolean isEnseignantDispenseAtDate(Long enseignantId, String date) {
        return dispenseRepository.existsByEnseignantIdAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(enseignantId, date, date);
    }

    @Override
    public List<Dispense> getActiveDispenses(String date) {
        return dispenseRepository.findByDateDebutLessThanEqualAndDateFinGreaterThanEqual(date, date);
    }
}