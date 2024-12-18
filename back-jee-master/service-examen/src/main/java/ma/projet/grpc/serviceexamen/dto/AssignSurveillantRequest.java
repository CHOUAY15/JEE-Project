package ma.projet.grpc.serviceexamen.dto;


public class AssignSurveillantRequest {
    // Utilisez des types primitifs ou des objets simples
    private Long examenId;
    private Long enseignant;
    private Long local;
    private String typeSurveillant;

    // Constructeurs
    public AssignSurveillantRequest() {}

    public AssignSurveillantRequest(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        this.examenId = examenId;
        this.enseignant = enseignantId;
        this.local = localId;
        this.typeSurveillant = typeSurveillant;
    }

    // Getters et setters standard
    public Long getExamenId() {
        return examenId;
    }

    public void setExamenId(Long examenId) {
        this.examenId = examenId;
    }

    public Long getEnseignantId() {
        return enseignant;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignant = enseignantId;
    }

    public Long getLocalId() {
        return local;
    }

    public void setLocalId(Long localId) {
        this.local = localId;
    }

    public String getTypeSurveillant() {
        return typeSurveillant;
    }

    public void setTypeSurveillant(String typeSurveillant) {
        this.typeSurveillant = typeSurveillant;
    }
}
