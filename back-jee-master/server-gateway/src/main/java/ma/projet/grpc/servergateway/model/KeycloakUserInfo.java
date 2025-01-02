package ma.projet.grpc.servergateway.model;

public class KeycloakUserInfo {
    private String sub;  // Keycloak user ID
    private String email;

    public String getSub() {
        return sub;
    }

    public KeycloakUserInfo(String sub, String email, String firstName, String lastName) {
        this.sub = sub;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public KeycloakUserInfo() {

    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    private String firstName;
    private String lastName;
}
