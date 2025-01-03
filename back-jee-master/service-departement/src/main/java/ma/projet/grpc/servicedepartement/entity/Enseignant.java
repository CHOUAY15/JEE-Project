package ma.projet.grpc.servicedepartement.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL)
    private List<Dispense> dispenses;

    @Email(message = "Email non valide")
    private String email;

    private boolean estDispense;
    private int nbSurveillances;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEstDispense() {
        return estDispense;
    }

    public void setEstDispense(boolean estDispense) {
        this.estDispense = estDispense;
    }
    public int getNbSurveillances() {
        return nbSurveillances;
    }

    public void setNbSurveillances(int nbSurveillances) {
        this.nbSurveillances = nbSurveillances;
    }

    public Departement getDepartement() {
        return departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
    }
    @ManyToOne
    @JoinColumn(name = "departement_id")
    @JsonBackReference
    private Departement departement;
}
