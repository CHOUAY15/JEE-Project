package ma.projet.grpc.serviceexamen.entity;



import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity@Data@AllArgsConstructor
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


    @Column(name = "departement_id")
    private Long departementId;
    @JsonManagedReference
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    private List<Module> modules = new ArrayList<>();  // Initialisez la liste ici

    // Constructors
    public Option() {
    }

    public Option(String nomOption, int nombreEtudiant, String niveauAnnee, List<Module> modules, Long departementId) {
        this.nomOption = nomOption;
        this.nombreEtudiant = nombreEtudiant;
        this.niveauAnnee = niveauAnnee;
        this.modules = modules;
        this.departementId = departementId;
    }

    // Add getters and setters for new fields
    public Long getDepartementId() {
        return departementId;
    }

    public void setDepartementId(Long departementId) {
        this.departementId = departementId;
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

