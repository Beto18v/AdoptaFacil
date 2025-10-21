package com.example.demo.strategy;

import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.RecoveryEmailRequest;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.service.EmailTemplateService;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.Map;

/**
 * Estrategia para enviar emails de recuperación de contraseña usando plantillas.
 * Utiliza el servicio de plantillas para obtener el contenido dinámico.
 */
public class RecoveryEmailStrategy implements EmailStrategy {

    private final EmailTemplateService templateService;

    public RecoveryEmailStrategy(EmailTemplateService templateService) {
        this.templateService = templateService;
    }

    @Override
    public void sendEmail(EmailRequest request, MimeMessage message) throws Exception {
        RecoveryEmailRequest recoveryRequest = (RecoveryEmailRequest) request;
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Configurar destinatario
        helper.setTo(recoveryRequest.getEmail());

        // Obtener asunto de la plantilla
        String subject = templateService.getSubject(EmailTemplateType.RECOVERY);
        helper.setSubject(subject);

        // Preparar placeholders para la plantilla
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("name", recoveryRequest.getName());
        placeholders.put("token", recoveryRequest.getToken());
        placeholders.put("email", recoveryRequest.getEmail());
        
        // Construir el enlace de restablecimiento
        String encodedEmail = java.net.URLEncoder.encode(recoveryRequest.getEmail(), java.nio.charset.StandardCharsets.UTF_8);
        String resetLink = "http://127.0.0.1:8000/auth/reset-password/" + encodedEmail;
        placeholders.put("resetLink", resetLink);

        // Procesar plantilla con placeholders
        String htmlContent = templateService.processTemplate(EmailTemplateType.RECOVERY, placeholders);
        helper.setText(htmlContent, true); // true indica que es HTML
    }
}