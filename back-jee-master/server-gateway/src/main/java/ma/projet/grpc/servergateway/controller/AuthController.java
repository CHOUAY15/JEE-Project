package ma.projet.grpc.servergateway.controller;

import ma.projet.grpc.servergateway.model.AuthResponse;

import ma.projet.grpc.servergateway.model.TokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final WebClient keycloakClient;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Value("${keycloak.token-uri}")
    private String tokenUri;

    @Value("${keycloak.userinfo-uri}")
    private String userInfoUri;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.redirect-uri}")
    private String redirectUri;

    public AuthController(WebClient.Builder webClientBuilder) {
        this.keycloakClient = WebClient.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(16 * 1024 * 1024))
                .build();
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestParam String code) {
        log.info("Received login request with code: {}", code);

        return exchangeCodeForTokens(code)
                .doOnNext(tokenResponse -> {
                    log.info("Received token response: {}", tokenResponse);
                    if (tokenResponse.getAccessToken() == null) {
                        log.error("Access token is null");
                    } else {
                        log.info("Token exchange successful");
                    }
                })
                .doOnError(e -> log.error("Token exchange failed", e))
                .map(tokenResponse -> new AuthResponse(
                        tokenResponse.getAccessToken(),
                        tokenResponse.getRefreshToken()// No participant
                ))
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    log.error("Authentication failed", e);
                    return Mono.just(ResponseEntity
                            .status(HttpStatus.UNAUTHORIZED)
                            .body(new AuthResponse(null, null)));
                });
    }

    @PostMapping("/refresh")
    public Mono<ResponseEntity<AuthResponse>> refresh(@RequestParam String refreshToken) {
        log.info("Refresh attempt with token: {}", refreshToken);

        return refreshAccessToken(refreshToken)
                .map(tokenResponse -> new AuthResponse(
                        tokenResponse.getAccessToken(),
                        tokenResponse.getRefreshToken()))
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    log.error("Error during token refresh: {}", e.getMessage(), e);
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }

    private Mono<TokenResponse> exchangeCodeForTokens(String code) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", clientId);
        formData.add("code", code);
        formData.add("redirect_uri", redirectUri);

        log.info("Exchanging code for tokens with data: {}", formData);

        return keycloakClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .doOnError(e -> log.error("Token exchange request failed", e))
                .onErrorMap(e -> {
                    log.error("Token exchange error", e);
                    return new RuntimeException("Token exchange failed: " + e.getMessage());
                });
    }

    private Mono<TokenResponse> refreshAccessToken(String refreshToken) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "refresh_token");
        formData.add("client_id", clientId);
        formData.add("refresh_token", refreshToken);

        return keycloakClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(TokenResponse.class);
    }


}
