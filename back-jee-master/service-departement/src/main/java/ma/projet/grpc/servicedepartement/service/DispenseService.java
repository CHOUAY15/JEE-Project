package ma.projet.grpc.servicedepartement.service;

import ma.projet.grpc.servicedepartement.entity.Dispense;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DispenseService {
    List<Dispense> getDispensesByEnseignantId(Long enseignantId);
    Dispense createDispense(Long enseignantId, Dispense dispense);
    Dispense updateDispense(Long enseignantId, Long dispenseId, Dispense dispense);
    void deleteDispense(Long enseignantId, Long dispenseId);
    boolean isEnseignantDispenseAtDate(Long enseignantId, String date);
    List<Dispense> getActiveDispenses(String date);
}