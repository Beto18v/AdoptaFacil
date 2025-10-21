package com.example.demo.controller;

import com.example.demo.dto.NotificationEmailRequest;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class NotificationEmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-notification-email")
    public ResponseEntity<String> sendNotificationEmail(@Valid @RequestBody NotificationEmailRequest request) {
        try {
            emailService.sendNotificationEmail(request);
            return ResponseEntity.ok("Email de notificación enviado exitosamente a " + request.getEmail());
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Solicitud inválida: " + e.getMessage());
        }
    }
}