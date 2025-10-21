package com.example.demo.controller;

import com.example.demo.dto.BulkEmailRequest;
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
public class BulkEmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-bulk-email")
    public ResponseEntity<String> sendBulkEmail(@Valid @RequestBody BulkEmailRequest request) {
        try {
            emailService.sendBulkEmail(request);
            return ResponseEntity.ok("Solicitud de envío de emails masivos procesada para " + request.getEmails().size() + " destinatarios. Revisa los logs para detalles.");
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la solicitud de emails masivos: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Solicitud inválida: " + e.getMessage());
        }
    }
}