package ma.projet.grpc.serviceexamen.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.projet.grpc.servicedepartement.entity.Enseignant;
import ma.projet.grpc.servicedepartement.entity.Local;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveillanceAssignation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "examen_id")
    private Examen examen;


    private Long enseignant;


    private Long local;

    private String typeSurveillant;// PRINCIPAL ou RESERVISTE



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Examen getExamen() {
        return examen;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    public Long getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Long enseignant) {
        this.enseignant = enseignant;
    }

    public Long getLocal() {
        return local;
    }

    public void setLocal(Long local) {
        this.local = local;
    }

    public String getTypeSurveillant() {
        return typeSurveillant;
    }

    public void setTypeSurveillant(String typeSurveillant) {
        this.typeSurveillant = typeSurveillant;
    }
}
