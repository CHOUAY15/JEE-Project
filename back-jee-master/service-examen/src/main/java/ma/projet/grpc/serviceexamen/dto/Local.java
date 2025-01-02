package ma.projet.grpc.serviceexamen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Local {

    private int id;
    private String nom;
    private int capacite;
    private String type;
    private int nbSurveillants;
    private boolean estDisponible;
}