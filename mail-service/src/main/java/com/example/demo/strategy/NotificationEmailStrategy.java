package com.example.demo.strategy;

import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.NotificationEmailRequest;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.service.EmailTemplateService;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.Map;

/**
 * Estrategia para enviar emails de notificación usando plantillas.
 * Utiliza el servicio de plantillas para obtener el contenido dinámico.
 */
public class NotificationEmailStrategy implements EmailStrategy {

    private final EmailTemplateService templateService;

    public NotificationEmailStrategy(EmailTemplateService templateService) {
        this.templateService = templateService;
    }

    @Override
    public void sendEmail(EmailRequest request, MimeMessage message) throws Exception {
        NotificationEmailRequest notificationRequest = (NotificationEmailRequest) request;
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Configurar destinatario
        helper.setTo(notificationRequest.getEmail());

        // Obtener asunto de la plantilla
        String subject = templateService.getSubject(EmailTemplateType.NOTIFICATION);
        helper.setSubject(subject);

        // Preparar placeholders para la plantilla
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("name", notificationRequest.getName());
        placeholders.put("message", notificationRequest.getMessage().replace("\n", "<br>"));

        // Procesar plantilla con placeholders
        String htmlContent = templateService.processTemplate(EmailTemplateType.NOTIFICATION, placeholders);
        helper.setText(htmlContent, true); // true indica que es HTML
    }
}