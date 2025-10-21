package com.example.demo.controller;

import com.example.demo.dto.WelcomeEmailRequest;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class WelcomeEmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Microservicio funcionando correctamente");
    }

    @PostMapping("/send-welcome-email")
    public ResponseEntity<String> sendWelcomeEmail(@Valid @RequestBody WelcomeEmailRequest request) {
        try {
            emailService.sendWelcomeEmail(request);
            return ResponseEntity.ok("Email de bienvenida enviado exitosamente a " + request.getEmail());
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Solicitud inválida: " + e.getMessage());
        }
    }
}