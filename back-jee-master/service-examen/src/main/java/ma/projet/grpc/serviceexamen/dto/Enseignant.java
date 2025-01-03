package ma.projet.grpc.serviceexamen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enseignant {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private boolean estDispense;
    private int nbSurveillances;
    private Long departementId; // Utilisation d'un ID pour référencer le département
}