package com.example.demo.service;

import com.example.demo.model.PasswordResetToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class PasswordResetService {

    private final Map<String, PasswordResetToken> tokens = new ConcurrentHashMap<>();
    private static final int TOKEN_LENGTH = 6;
    private static final int EXPIRY_MINUTES = 15;

    /**
     * Genera un token de 6 dígitos para el email dado.
     * @param email Email del usuario
     * @return Token generado
     */
    public String generateToken(String email) {
        String token = generateRandomToken();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(EXPIRY_MINUTES);
        PasswordResetToken resetToken = new PasswordResetToken(email, token, expiry);
        tokens.put(email, resetToken);
        return token;
    }

    /**
     * Valida si el token es válido para el email.
     * @param email Email
     * @param token Token a validar
     * @return true si válido, false en caso contrario
     */
    public boolean validateToken(String email, String token) {
        PasswordResetToken resetToken = tokens.get(email);
        if (resetToken == null || resetToken.isExpired()) {
            return false;
        }
        return resetToken.getToken().equals(token);
    }

    /**
     * Elimina el token después de usarlo.
     * @param email Email
     */
    public void removeToken(String email) {
        tokens.remove(email);
    }

    private String generateRandomToken() {
        Random random = new Random();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }
}