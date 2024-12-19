package ma.projet.grpc.serviceexamen.entity;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;
import java.time.LocalDate;

@Entity
public class Examen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Session session;

    private Long departementId;  // Utilisation de l'ID du département au lieu de l'objet Departement

    private Long enseignantId;   // Utilisation de l'ID de l'enseignant au lieu de l'objet Enseignant

    private String module;
    private LocalDate date;
    private String horaire;      // Exemple : "start1-end1"
    private int nbEtudiants;


    @ElementCollection
    @CollectionTable(name = "examen_locaux", joinColumns = @JoinColumn(name = "examen_id"))
    @Column(name = "local_id")
    private Set<Long> locaux = new HashSet<>();  // Stockage des IDs des locaux

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Long getDepartementId() {
        return departementId;
    }

    public void setDepartementId(Long departementId) {
        this.departementId = departementId;
    }

    public Long getEnseignantId() {
        return enseignantId;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignantId = enseignantId;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getHoraire() {
        return horaire;
    }

    public void setHoraire(String horaire) {
        this.horaire = horaire;
    }

    public int getNbEtudiants() {
        return nbEtudiants;
    }

    public void setNbEtudiants(int nbEtudiants) {
        this.nbEtudiants = nbEtudiants;
    }

    public Set<Long> getLocaux() {
        return locaux;
    }

    public void setLocaux(Set<Long> locaux) {
        this.locaux = locaux;
    }
}
