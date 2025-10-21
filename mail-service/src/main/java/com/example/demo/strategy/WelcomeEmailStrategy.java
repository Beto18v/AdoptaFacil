package com.example.demo.strategy;

import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.WelcomeEmailRequest;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.service.EmailTemplateService;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.Map;

/**
 * Estrategia para enviar emails de bienvenida usando plantillas.
 * Utiliza el servicio de plantillas para obtener el contenido dinámico.
 */
public class WelcomeEmailStrategy implements EmailStrategy {

    private final EmailTemplateService templateService;

    public WelcomeEmailStrategy(EmailTemplateService templateService) {
        if (templateService == null) {
            throw new NullPointerException("EmailTemplateService cannot be null");
        }
        this.templateService = templateService;
    }

    @Override
    public void sendEmail(EmailRequest request, MimeMessage message) throws Exception {
        WelcomeEmailRequest welcomeRequest = (WelcomeEmailRequest) request;
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Configurar destinatario
        helper.setTo(welcomeRequest.getEmail());

        // Obtener asunto de la plantilla
        String subject = templateService.getSubject(EmailTemplateType.WELCOME);
        helper.setSubject(subject);

        // Preparar placeholders para la plantilla
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("name", welcomeRequest.getName());

        // Procesar plantilla con placeholders
        String htmlContent = templateService.processTemplate(EmailTemplateType.WELCOME, placeholders);
        helper.setText(htmlContent, true); // true indica que es HTML
    }
}