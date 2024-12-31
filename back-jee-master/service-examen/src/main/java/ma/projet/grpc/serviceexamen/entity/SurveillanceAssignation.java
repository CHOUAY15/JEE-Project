package ma.projet.grpc.serviceexamen.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

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

    // Ajouter ces deux champs
    private LocalDate date;

    private String horaire;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
}