package com.example.demo.controller;

import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.dto.RecoveryEmailRequest;
import com.example.demo.service.EmailService;
import com.example.demo.service.PasswordResetService;
import com.example.demo.service.UserApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class RecoveryEmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserApiService userApiService;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/send-recovery-email")
    public ResponseEntity<String> sendRecoveryEmail(@Valid @RequestBody RecoveryEmailRequest request) {
        try {
            emailService.sendRecoveryEmail(request);
            return ResponseEntity.ok("Email de recuperación enviado exitosamente a " + request.getEmail());
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Solicitud inválida: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            // Validar si el email existe en la API de Laravel
            if (!userApiService.validateEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El email no está registrado en el sistema.");
            }

            // Generar token
            String token = passwordResetService.generateToken(request.getEmail());

            // Enviar email con el token
            RecoveryEmailRequest recoveryRequest = new RecoveryEmailRequest(request.getEmail(), "Usuario", token);
            emailService.sendRecoveryEmail(recoveryRequest);

            return ResponseEntity.ok("Se ha enviado un código de recuperación a tu email.");
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Solicitud inválida: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            // Validar que las contraseñas coincidan
            if (!request.passwordsMatch()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Las contraseñas no coinciden.");
            }

            // Validar token
            if (!passwordResetService.validateToken(request.getEmail(), request.getToken())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Token inválido o expirado.");
            }

            // Resetear contraseña en Laravel API
            if (!userApiService.resetPassword(request.getEmail(), request.getNewPassword())) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al actualizar la contraseña.");
            }

            // Remover token usado
            passwordResetService.removeToken(request.getEmail());

            return ResponseEntity.ok("Contraseña actualizada exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Solicitud inválida: " + e.getMessage());
        }
    }
}