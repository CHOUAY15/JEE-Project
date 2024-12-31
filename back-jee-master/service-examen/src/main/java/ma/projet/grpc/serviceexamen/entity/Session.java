package ma.projet.grpc.serviceexamen.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String typeSession;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String start1;
    private String end1;
    private String start2;
    private String end2;
    private String start3;
    private String end3;
    private String start4;
    private String end4;

}
