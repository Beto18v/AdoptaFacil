package com.example.demo.service;

import com.example.demo.dto.BulkEmailRequest;
import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.NotificationEmailRequest;
import com.example.demo.dto.RecoveryEmailRequest;
import com.example.demo.dto.WelcomeEmailRequest;
import com.example.demo.strategy.EmailStrategy;
import com.example.demo.strategy.NotificationEmailStrategy;
import com.example.demo.strategy.RecoveryEmailStrategy;
import com.example.demo.strategy.WelcomeEmailStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

import java.io.File;
import java.io.InputStream;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String mailUsername;
    private final EmailTemplateService templateService;

    @Autowired
    public EmailService(JavaMailSender mailSender,
                       @Value("${spring.mail.username}") String mailUsername,
                       EmailTemplateService templateService) {
        this.mailSender = mailSender;
        this.mailUsername = mailUsername;
        this.templateService = templateService;
    }

    @Async
    public void sendEmail(EmailStrategy strategy, EmailRequest request) throws Exception {
        logger.info("Enviando email usando estrategia: {} a {}", strategy.getClass().getSimpleName(), request.getEmail());
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(mailUsername);

        strategy.sendEmail(request, message);

        mailSender.send(message);
        logger.info("Email enviado exitosamente a {}", request.getEmail());
    }

    @Async
    public void sendWelcomeEmail(WelcomeEmailRequest request) throws Exception {
        sendEmail(new WelcomeEmailStrategy(templateService), request);
    }

    @Async
    public void sendRecoveryEmail(RecoveryEmailRequest request) throws Exception {
        sendEmail(new RecoveryEmailStrategy(templateService), request);
    }

    @Async
    public void sendNotificationEmail(NotificationEmailRequest request) throws Exception {
        sendEmail(new NotificationEmailStrategy(templateService), request);
    }

    @Async
    public void sendBulkEmail(BulkEmailRequest request) throws Exception {
        logger.info("Iniciando envío de emails masivos a {} destinatarios", request.getEmails().size());
        String logoUrl = "https://res.cloudinary.com/dlpm77uqp/image/upload/v1760971311/LogoGreen_ctnavt.png";
        String htmlContent = "<!DOCTYPE html>" +
         "<html lang=\"es\">" +
             "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>" + request.getSubject() + "</title>" +
                "<style>" +
                    "body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(90deg, #4ade80 0%, #60a5fa 100%); min-height: 100vh; }" +
                    ".container { max-width: 520px; margin: 40px auto; background: rgba(255,255,255,0.95); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); border: 1px solid rgba(255,255,255,0.18); }" +
                    ".header { background: linear-gradient(135deg, #4ade80 0%, #60a5fa 100%); padding: 32px 0 16px 0; text-align: center; }" +
                    ".logo { max-width: 180px; height: auto; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(76,175,80,0.15)); }" +
                    ".content { padding: 36px 32px 24px 32px; text-align: center; }" +
                    ".greeting { font-size: 28px; color: #22223b; margin-bottom: 18px; font-weight: bold; letter-spacing: 0.5px; }" +
                    ".message { font-size: 17px; color: #374151; line-height: 1.7; margin-bottom: 32px; }" +
                    ".cta-button { display: inline-block; background: linear-gradient(90deg, #4ade80 0%, #60a5fa 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 18px; box-shadow: 0 2px 8px rgba(76,175,80,0.10); transition: background 0.3s; }" +
                    ".cta-button:hover { background: linear-gradient(90deg, #22d3ee 0%, #6366f1 100%); }" +
                    ".footer { background: #f1f5f9; padding: 22px 0 18px 0; text-align: center; font-size: 15px; color: #64748b; border-top: 1px solid #e0e7ef; }" +
                    "@media (max-width: 600px) { .container { max-width: 98vw; margin: 8px; } .content { padding: 18px 8px 12px 8px; } .header { padding: 18px 0 8px 0; } }" +
                "</style>" +
                "</head>" +
            "<body>" +
                 "<div class=\"container\">" +
                "<div class=\"header\">" +
                    "<img src='" + logoUrl + "' alt=\"AdoptaFacil Logo\" class=\"logo\" style=\"display:block;margin:auto;\">" +
             "</div>" +

                    "<div class=\"content\">" +
                        "<h1 class=\"greeting\">" + request.getSubject() + "</h1>" +
                        "<p class=\"message\">" +
                            request.getDescription().replace("\n", "<br>") +
                        "</p>" +
                        "<a href=\"https://adoptafacil.com\" class=\"cta-button\">Visitar AdoptaFacil</a>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>Saludos cordiales,<br>El equipo de AdoptaFacil</p>" +
                        "<p>¿Tienes alguna pregunta? Escríbenos a <a href=\"mailto:notificacionesadoptafacil@gmail.com\" style=\"color:#60a5fa;text-decoration:none;\">notificacionesadoptafacil@gmail.com</a></p>" +
                    "</div>" +
                 "</div>" +
            "</body>" +
    "</html>";

        int successCount = 0;
        int failCount = 0;

        for (String email : request.getEmails()) {
            try {
                logger.info("Enviando email masivo a: {}", email);
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailUsername);
                helper.setTo(email);
                helper.setSubject(request.getSubject());
                helper.setText(htmlContent, true);
                mailSender.send(message);
                logger.info("Email enviado exitosamente a: {}", email);
                successCount++;
            } catch (Exception e) {
                logger.error("Error al enviar email a: {}", email, e);
                failCount++;
            }
        }
        logger.info("Envío de emails masivos completado. Exitosos: {}, Fallidos: {}", successCount, failCount);

        if (failCount > 0) {
            throw new Exception("Algunos emails no pudieron enviarse. Exitosos: " + successCount + ", Fallidos: " + failCount);
        }
    }
}