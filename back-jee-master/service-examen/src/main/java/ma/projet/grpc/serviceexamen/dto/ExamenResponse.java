package ma.projet.grpc.serviceexamen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamenResponse {
    private Long id;
    private String module;
    private LocalDate date;
    private String horaire;
    private Set<Long> locaux;
    private Long optionId;
    private String optionName;
    // ... autres champs ...
}