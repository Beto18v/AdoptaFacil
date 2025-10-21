package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class UserApiService {

    private final RestTemplate restTemplate;
    private final String laravelApiBaseUrl;
    private final String usersEndpoint;
    private final String resetPasswordEndpoint;

    @Autowired
    public UserApiService(RestTemplate restTemplate,
                         @Value("${laravel.api.base-url}") String laravelApiBaseUrl,
                         @Value("${laravel.api.users-endpoint}") String usersEndpoint,
                         @Value("${laravel.api.reset-password-endpoint}") String resetPasswordEndpoint) {
        this.restTemplate = restTemplate;
        this.laravelApiBaseUrl = laravelApiBaseUrl;
        this.usersEndpoint = usersEndpoint;
        this.resetPasswordEndpoint = resetPasswordEndpoint;
    }

    /**
     * Valida si un email existe en la API de usuarios de Laravel.
     * @param email Email a validar
     * @return true si el email existe, false en caso contrario
     */
    public boolean validateEmail(String email) {
        try {
            String url = laravelApiBaseUrl + usersEndpoint + "/validate-email";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, Map.of("email", email), Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Object valid = body.get("valid");
                return Boolean.TRUE.equals(valid);
            }

            return false;
        } catch (Exception e) {
            // Log error
            return false;
        }
    }

    /**
     * Resetea la contraseña del usuario en la API de Laravel.
     * @param email Email del usuario
     * @param newPassword Nueva contraseña
     * @return true si se reseteo exitosamente, false en caso contrario
     */
    public boolean resetPassword(String email, String newPassword) {
        try {
            String url = laravelApiBaseUrl + resetPasswordEndpoint;
            Map<String, String> request = Map.of("email", email, "password", newPassword);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            // Log error
            return false;
        }
    }
}