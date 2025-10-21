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

        // Procesar plantilla con placeholders
        String htmlContent = templateService.processTemplate(EmailTemplateType.RECOVERY, placeholders);
        helper.setText(htmlContent, true); // true indica que es HTML
    }
}