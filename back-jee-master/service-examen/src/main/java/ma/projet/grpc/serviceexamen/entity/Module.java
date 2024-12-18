package ma.projet.grpc.serviceexamen.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Module {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private Long responsableId;

    // Relationship with Option (Many Modules belong to one Option)
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    private Option option;

    // Constructors
    public Module() {
    }

    public Module(String nom, Long responsableId, Option option) {
        this.nom = nom;
        this.responsableId = responsableId;
        this.option = option;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Long getResponsableId() {
        return responsableId;
    }

    public void setResponsableId(Long responsableId) {
        this.responsableId = responsableId;
    }

    public Option getOption() {
        return option;
    }

    public void setOption(Option option) {
        this.option = option;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "Module{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", responsableId=" + responsableId +
                ", option=" + option +
                '}';
    }
}
