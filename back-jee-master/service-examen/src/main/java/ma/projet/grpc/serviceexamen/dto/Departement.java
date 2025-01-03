package ma.projet.grpc.serviceexamen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Departement {

    private Long id;
    private String nom;
    private List<Long> enseignantsIds; // Représente les enseignants par leurs IDs pour simplifier
}
