package com.example.demo.controller;

import com.example.demo.dto.RecoveryEmailRequest;
import com.example.demo.service.EmailService;
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
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api")
public class RecoveryEmailController {

    @Autowired
    private EmailService emailService;

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
}