package ma.projet.grpc.servicedepartement.service;


import ma.projet.grpc.servicedepartement.entity.Enseignant;

import java.util.List;
import java.util.Map;

public interface EnseignantService {
    List<Enseignant> getAllEnseignants();
    Enseignant getEnseignantById(Long id);
    Enseignant createEnseignant(Enseignant enseignant);
    Enseignant updateEnseignant(Long id, Enseignant enseignant);
    void deleteEnseignant(Long id);
    Map<String, Double> getPercentageDispenses();
    List<Enseignant> getEnseignantsDisponibles();
    Enseignant getEnseignantByNom(String nom);
}