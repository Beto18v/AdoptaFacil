package com.example.demo.integration;

import com.example.demo.model.EmailTemplate;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.seeder.EmailTemplateSeeder;
import com.example.demo.service.EmailTemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Email Template System Integration Tests")
class EmailTemplateSystemIntegrationTest {

    @Autowired
    private EmailTemplateService templateService;

    @Autowired
    private EmailTemplateSeeder seeder;

    @BeforeEach
    void setUp() {
        // Limpiar plantillas antes de cada test
        templateService.clearAll();
    }

    @Test
    @DisplayName("Seeder debe inicializar todas las plantillas correctamente")
    void seeder_ShouldInitializeAllTemplates() throws Exception {
        // When
        seeder.run();

        // Then
        assertEquals(3, templateService.getActiveTemplateCount());
        assertTrue(templateService.templateExists(EmailTemplateType.WELCOME));
        assertTrue(templateService.templateExists(EmailTemplateType.RECOVERY));
        assertTrue(templateService.templateExists(EmailTemplateType.NOTIFICATION));
    }

    @Test
    @DisplayName("Debe procesar plantilla de bienvenida con placeholders")
    void welcomeTemplate_ShouldProcessWithPlaceholders() throws Exception {
        // Given
        seeder.run();
        Map<String, String> placeholders = Map.of("name", "María González");

        // When
        String subject = templateService.getSubject(EmailTemplateType.WELCOME);
        String content = templateService.processTemplate(EmailTemplateType.WELCOME, placeholders);

        // Then
        assertEquals("¡Bienvenido a AdoptaFacil!", subject);
        assertTrue(content.contains("María González"));
        assertTrue(content.contains("Bienvenido"));
        assertTrue(content.contains("AdoptaFacil"));
        assertTrue(content.contains("corazones con patitas"));
    }

    @Test
    @DisplayName("Debe procesar plantilla de recuperación con token")
    void recoveryTemplate_ShouldProcessWithToken() throws Exception {
        // Given
        seeder.run();
        Map<String, String> placeholders = Map.of(
            "name", "Carlos Rodríguez",
            "token", "XYZ789ABC"
        );

        // When
        String subject = templateService.getSubject(EmailTemplateType.RECOVERY);
        String content = templateService.processTemplate(EmailTemplateType.RECOVERY, placeholders);

        // Then
        assertEquals("Recupera tu acceso a AdoptaFacil", subject);
        assertTrue(content.contains("Carlos Rodríguez"));
        assertTrue(content.contains("XYZ789ABC"));
        assertTrue(content.contains("restablecer"));
        assertTrue(content.contains("contraseña"));
    }

    @Test
    @DisplayName("Debe procesar plantilla de notificación con mensaje personalizado")
    void notificationTemplate_ShouldProcessWithCustomMessage() throws Exception {
        // Given
        seeder.run();
        String customMessage = "Tu mascota Luna ha sido adoptada exitosamente por una familia maravillosa.";
        Map<String, String> placeholders = Map.of(
            "name", "Ana López",
            "message", customMessage.replace("\n", "<br>")
        );

        // When
        String subject = templateService.getSubject(EmailTemplateType.NOTIFICATION);
        String content = templateService.processTemplate(EmailTemplateType.NOTIFICATION, placeholders);

        // Then
        assertEquals("Notificación de AdoptaFacil", subject);
        assertTrue(content.contains("Ana López"));
        assertTrue(content.contains("Luna ha sido adoptada"));
        assertTrue(content.contains("familia maravillosa"));
    }

    @Test
    @DisplayName("Debe manejar placeholders faltantes sin errores")
    void templateProcessing_ShouldHandleMissingPlaceholders() throws Exception {
        // Given
        seeder.run();
        Map<String, String> incompletePlaceholders = Map.of("name", "Test User");
        // Falta el placeholder "token" para recovery

        // When
        String content = templateService.processTemplate(EmailTemplateType.RECOVERY, incompletePlaceholders);

        // Then
        assertTrue(content.contains("Test User"));
        assertTrue(content.contains("{{token}}")); // Placeholder sin reemplazar
    }

    @Test
    @DisplayName("Debe permitir desactivar plantillas")
    void templateDeactivation_ShouldWorkCorrectly() throws Exception {
        // Given
        seeder.run();
        assertTrue(templateService.templateExists(EmailTemplateType.WELCOME));

        // When
        boolean deactivated = templateService.deactivateTemplate("welcome-template");

        // Then
        assertTrue(deactivated);
        assertFalse(templateService.templateExists(EmailTemplateType.WELCOME));
        assertEquals(2, templateService.getActiveTemplateCount());
    }

    @Test
    @DisplayName("Debe devolver todas las plantillas activas")
    void findAllActive_ShouldReturnOnlyActiveTemplates() throws Exception {
        // Given
        seeder.run();
        templateService.deactivateTemplate("welcome-template");

        // When
        var activeTemplates = templateService.findAllActive();

        // Then
        assertEquals(2, activeTemplates.size());
        assertTrue(activeTemplates.stream().allMatch(EmailTemplate::isActive));
        assertFalse(activeTemplates.stream().anyMatch(t -> t.getId().equals("welcome-template")));
    }

    @Test
    @DisplayName("Plantillas deben contener HTML válido")
    void templates_ShouldContainValidHtml() throws Exception {
        // Given
        seeder.run();

        // When & Then
        for (EmailTemplateType type : EmailTemplateType.values()) {
            String content = templateService.processTemplate(type, Map.of());
            assertTrue(content.contains("<!DOCTYPE html>"));
            assertTrue(content.contains("<html"));
            assertTrue(content.contains("<head>"));
            assertTrue(content.contains("<body>"));
            assertTrue(content.contains("</html>"));
        }
    }

    @Test
    @DisplayName("Plantillas deben ser responsive (contener media queries)")
    void templates_ShouldBeResponsive() throws Exception {
        // Given
        seeder.run();

        // When & Then
        for (EmailTemplateType type : EmailTemplateType.values()) {
            String content = templateService.processTemplate(type, Map.of());
            assertTrue(content.contains("@media"));
            assertTrue(content.contains("max-width"));
        }
    }

    @Test
    @DisplayName("Plantillas deben contener el logo de AdoptaFacil")
    void templates_ShouldContainAdoptaFacilBranding() throws Exception {
        // Given
        seeder.run();

        // When & Then
        for (EmailTemplateType type : EmailTemplateType.values()) {
            String content = templateService.processTemplate(type, Map.of());
            assertTrue(content.contains("AdoptaFacil"));
            assertTrue(content.contains("corazones con patitas") ||
                      content.contains("🐾") ||
                      content.contains("Cloudinary"));
        }
    }
}