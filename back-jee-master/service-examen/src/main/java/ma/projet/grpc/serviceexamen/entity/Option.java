package ma.projet.grpc.serviceexamen.entity;



import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Option {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomOption;

    @Column(nullable = false)
    private int nombreEtudiant;

    @Column(nullable = false)
    private String niveauAnnee;

    @JsonManagedReference
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    private List<Module> modules = new ArrayList<>();  // Initialisez la liste ici

    // Constructors
    public Option() {
    }

    public Option(String nomOption, int nombreEtudiant, String niveauAnnee, List<Module> modules) {
        this.nomOption = nomOption;
        this.nombreEtudiant = nombreEtudiant;
        this.niveauAnnee = niveauAnnee;
        this.modules = modules;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getNomOption() {
        return nomOption;
    }

    public void setNomOption(String nomOption) {
        this.nomOption = nomOption;
    }

    public int getNombreEtudiant() {
        return nombreEtudiant;
    }

    public void setNombreEtudiant(int nombreEtudiant) {
        this.nombreEtudiant = nombreEtudiant;
    }

    public String getNiveauAnnee() {
        return niveauAnnee;
    }

    public void setNiveauAnnee(String niveauAnnee) {
        this.niveauAnnee = niveauAnnee;
    }

    public List<Module> getModules() {
        return modules;
    }

    public void setModules(List<Module> modules) {
        this.modules = modules;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "Option{" +
                "id=" + id +
                ", nomOption='" + nomOption + '\'' +
                ", nombreEtudiant=" + nombreEtudiant +
                ", niveauAnnee='" + niveauAnnee + '\'' +
                ", modules=" + modules +
                '}';
    }
}

