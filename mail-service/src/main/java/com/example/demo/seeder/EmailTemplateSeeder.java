package com.example.demo.seeder;

import com.example.demo.model.EmailTemplate;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.service.EmailTemplateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeder que inicializa las plantillas de email predeterminadas en el sistema.
 * Se ejecuta automáticamente al iniciar la aplicación.
 */
@Component
public class EmailTemplateSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(EmailTemplateSeeder.class);

    private final EmailTemplateService templateService;

    @Autowired
    public EmailTemplateSeeder(EmailTemplateService templateService) {
        this.templateService = templateService;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Iniciando seeding de plantillas de email...");

        seedWelcomeTemplate();
        seedRecoveryTemplate();
        seedNotificationTemplate();

        logger.info("Seeding completado. Plantillas activas: {}",
                   templateService.getActiveTemplateCount());
    }

    /**
     * Crea e inicializa la plantilla de email de bienvenida.
     */
    private void seedWelcomeTemplate() {
        if (templateService.templateExists(EmailTemplateType.WELCOME)) {
            logger.debug("Plantilla de bienvenida ya existe, omitiendo...");
            return;
        }

        String logoUrl = "https://res.cloudinary.com/dlpm77uqp/image/upload/v1760971311/LogoGreen_ctnavt.png";
        String htmlContent = "<!DOCTYPE html>" +
            "<html lang=\"es\">" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>Bienvenido a AdoptaFacil</title>" +
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
                        "<h1 class=\"greeting\">¡Hola {{name}}!</h1>" +
                        "<p class=\"message\">" +
                            "Bienvenido a <strong>AdoptaFacil</strong>, la plataforma que conecta corazones con patitas.<br>" +
                            "Estamos emocionados de tenerte con nosotros. ¡Explora, adopta y cambia vidas!" +
                        "</p>" +
                        "<a href=\"https://adoptafacil.com/dashboard\" class=\"cta-button\">Comenzar mi viaje</a>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>AdoptaFacil - Conectando corazones con patitas 🐾</p>" +
                        "<p>Si tienes preguntas, contáctanos en <a href=\"mailto:info@adoptafacil.com\">info@adoptafacil.com</a></p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";

        EmailTemplate welcomeTemplate = new EmailTemplate(
            "welcome-template",
            EmailTemplateType.WELCOME,
            "¡Bienvenido a AdoptaFacil!",
            htmlContent,
            "Plantilla de bienvenida para nuevos usuarios registrados"
        );

        templateService.saveTemplate(welcomeTemplate);
        logger.info("Plantilla de bienvenida creada exitosamente");
    }

    /**
     * Crea e inicializa la plantilla de email de recuperación de contraseña.
     */
    private void seedRecoveryTemplate() {
        if (templateService.templateExists(EmailTemplateType.RECOVERY)) {
            logger.debug("Plantilla de recuperación ya existe, omitiendo...");
            return;
        }

        String logoUrl = "https://res.cloudinary.com/dlpm77uqp/image/upload/v1760971311/LogoGreen_ctnavt.png";
        String htmlContent = "<!DOCTYPE html>" +
            "<html lang=\"es\">" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>Recuperación de Contraseña</title>" +
                "<style>" +
                    "body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%); min-height: 100vh; }" +
                    ".container { max-width: 520px; margin: 40px auto; background: rgba(255,255,255,0.95); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); border: 1px solid rgba(255,255,255,0.18); }" +
                    ".header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 32px 0 16px 0; text-align: center; }" +
                    ".logo { max-width: 180px; height: auto; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(245,158,11,0.15)); }" +
                    ".content { padding: 36px 32px 24px 32px; text-align: center; }" +
                    ".greeting { font-size: 28px; color: #22223b; margin-bottom: 18px; font-weight: bold; letter-spacing: 0.5px; }" +
                    ".message { font-size: 17px; color: #374151; line-height: 1.7; margin-bottom: 32px; }" +
                    ".token-box { background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #92400e; letter-spacing: 2px; }" +
                    ".cta-button { display: inline-block; background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 18px; box-shadow: 0 2px 8px rgba(245,158,11,0.10); transition: background 0.3s; }" +
                    ".cta-button:hover { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }" +
                    ".warning { background: #fee2e2; border-left: 4px solid #dc2626; padding: 12px 16px; margin: 20px 0; font-size: 14px; color: #991b1b; }" +
                    ".footer { background: #f1f5f9; padding: 22px 0 18px 0; text-align: center; font-size: 15px; color: #64748b; border-top: 1px solid #e0e7ef; }" +
                    "@media (max-width: 600px) { .container { max-width: 98vw; margin: 8px; } .content { padding: 18px 8px 12px 8px; } .header { padding: 18px 0 8px 0; } .token-box { font-size: 16px; padding: 15px; } }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class=\"container\">" +
                    "<div class=\"header\">" +
                        "<img src='" + logoUrl + "' alt=\"AdoptaFacil Logo\" class=\"logo\" style=\"display:block;margin:auto;\">" +
                    "</div>" +
                    "<div class=\"content\">" +
                        "<h1 class=\"greeting\">Recuperación de Contraseña</h1>" +
                        "<p class=\"message\">Hola {{name}},<br>Hemos recibido una solicitud para restablecer tu contraseña.</p>" +
                        "<div class=\"token-box\">{{token}}</div>" +
                        "<p class=\"message\">Usa este código para crear una nueva contraseña. El código expira en 15 minutos.</p>" +
                        "<a href=\"https://adoptafacil.com/reset-password?token={{token}}\" class=\"cta-button\">Restablecer Contraseña</a>" +
                        "<div class=\"warning\">" +
                            "<strong>Importante:</strong> Si no solicitaste este cambio, ignora este mensaje. Tu contraseña seguirá siendo segura." +
                        "</div>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>AdoptaFacil - Conectando corazones con patitas 🐾</p>" +
                        "<p>¿Necesitas ayuda? Contáctanos en <a href=\"mailto:support@adoptafacil.com\">support@adoptafacil.com</a></p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";

        EmailTemplate recoveryTemplate = new EmailTemplate(
            "recovery-template",
            EmailTemplateType.RECOVERY,
            "Recupera tu acceso a AdoptaFacil",
            htmlContent,
            "Plantilla para recuperación de contraseña con token seguro"
        );

        templateService.saveTemplate(recoveryTemplate);
        logger.info("Plantilla de recuperación creada exitosamente");
    }

    /**
     * Crea e inicializa la plantilla de email de notificaciones.
     */
    private void seedNotificationTemplate() {
        if (templateService.templateExists(EmailTemplateType.NOTIFICATION)) {
            logger.debug("Plantilla de notificación ya existe, omitiendo...");
            return;
        }

        String logoUrl = "https://res.cloudinary.com/dlpm77uqp/image/upload/v1760971311/LogoGreen_ctnavt.png";
        String htmlContent = "<!DOCTYPE html>" +
            "<html lang=\"es\">" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>Notificación de AdoptaFacil</title>" +
                "<style>" +
                    "body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%); min-height: 100vh; }" +
                    ".container { max-width: 520px; margin: 40px auto; background: rgba(255,255,255,0.95); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); border: 1px solid rgba(255,255,255,0.18); }" +
                    ".header { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); padding: 32px 0 16px 0; text-align: center; }" +
                    ".logo { max-width: 180px; height: auto; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(59,130,246,0.15)); }" +
                    ".content { padding: 36px 32px 24px 32px; text-align: center; }" +
                    ".greeting { font-size: 28px; color: #22223b; margin-bottom: 18px; font-weight: bold; letter-spacing: 0.5px; }" +
                    ".message { font-size: 17px; color: #374151; line-height: 1.7; margin-bottom: 32px; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; text-align: left; }" +
                    ".cta-button { display: inline-block; background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 18px; box-shadow: 0 2px 8px rgba(59,130,246,0.10); transition: background 0.3s; }" +
                    ".cta-button:hover { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }" +
                    ".footer { background: #f1f5f9; padding: 22px 0 18px 0; text-align: center; font-size: 15px; color: #64748b; border-top: 1px solid #e0e7ef; }" +
                    "@media (max-width: 600px) { .container { max-width: 98vw; margin: 8px; } .content { padding: 18px 8px 12px 8px; } .header { padding: 18px 0 8px 0; } .message { text-align: center; } }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class=\"container\">" +
                    "<div class=\"header\">" +
                        "<img src='" + logoUrl + "' alt=\"AdoptaFacil Logo\" class=\"logo\" style=\"display:block;margin:auto;\">" +
                    "</div>" +
                    "<div class=\"content\">" +
                        "<h1 class=\"greeting\">¡Hola {{name}}!</h1>" +
                        "<div class=\"message\">{{message}}</div>" +
                        "<a href=\"https://adoptafacil.com/dashboard\" class=\"cta-button\">Ir al Panel</a>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>AdoptaFacil - Conectando corazones con patitas 🐾</p>" +
                        "<p>Para más información, visita <a href=\"https://adoptafacil.com\">nuestro sitio web</a></p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";

        EmailTemplate notificationTemplate = new EmailTemplate(
            "notification-template",
            EmailTemplateType.NOTIFICATION,
            "Notificación de AdoptaFacil",
            htmlContent,
            "Plantilla genérica para notificaciones del sistema"
        );

        templateService.saveTemplate(notificationTemplate);
        logger.info("Plantilla de notificación creada exitosamente");
    }
}