package com.example.demo.service;

import com.example.demo.model.EmailTemplate;
import com.example.demo.model.EmailTemplateType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("EmailTemplateService Tests")
class EmailTemplateServiceTest {

    private EmailTemplateService templateService;

    @BeforeEach
    void setUp() {
        templateService = new EmailTemplateService();
    }

    @Test
    @DisplayName("Debe guardar y recuperar una plantilla por ID")
    void saveAndFindById_ShouldWorkCorrectly() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Test Subject",
            "<html>Test Content</html>",
            "Test template"
        );

        // When
        templateService.saveTemplate(template);
        Optional<EmailTemplate> result = templateService.findById("test-template");

        // Then
        assertTrue(result.isPresent());
        assertEquals("test-template", result.get().getId());
        assertEquals(EmailTemplateType.WELCOME, result.get().getType());
        assertEquals("Test Subject", result.get().getSubject());
    }

    @Test
    @DisplayName("Debe encontrar plantilla por tipo")
    void findByType_ShouldReturnCorrectTemplate() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "welcome-template",
            EmailTemplateType.WELCOME,
            "Welcome Subject",
            "<html>Welcome Content</html>",
            "Welcome template"
        );
        templateService.saveTemplate(template);

        // When
        Optional<EmailTemplate> result = templateService.findByType(EmailTemplateType.WELCOME);

        // Then
        assertTrue(result.isPresent());
        assertEquals("welcome-template", result.get().getId());
        assertEquals(EmailTemplateType.WELCOME, result.get().getType());
    }

    @Test
    @DisplayName("Debe devolver todas las plantillas activas")
    void findAllActive_ShouldReturnOnlyActiveTemplates() {
        // Given
        EmailTemplate activeTemplate = new EmailTemplate(
            "active-template",
            EmailTemplateType.WELCOME,
            "Active Subject",
            "<html>Active Content</html>",
            "Active template"
        );

        EmailTemplate inactiveTemplate = new EmailTemplate(
            "inactive-template",
            EmailTemplateType.RECOVERY,
            "Inactive Subject",
            "<html>Inactive Content</html>",
            "Inactive template"
        );
        inactiveTemplate.setActive(false);

        templateService.saveTemplate(activeTemplate);
        templateService.saveTemplate(inactiveTemplate);

        // When
        List<EmailTemplate> activeTemplates = templateService.findAllActive();

        // Then
        assertEquals(1, activeTemplates.size());
        assertEquals("active-template", activeTemplates.get(0).getId());
        assertTrue(activeTemplates.get(0).isActive());
    }

    @Test
    @DisplayName("Debe procesar plantilla con placeholders correctamente")
    void processTemplate_ShouldReplacePlaceholdersCorrectly() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome {{name}}",
            "<html>Hello {{name}}, welcome to {{app}}!</html>",
            "Test template"
        );
        templateService.saveTemplate(template);

        Map<String, String> placeholders = Map.of(
            "name", "John Doe",
            "app", "AdoptaFacil"
        );

        // When
        String result = templateService.processTemplate("test-template", placeholders);

        // Then
        assertEquals("<html>Hello John Doe, welcome to AdoptaFacil!</html>", result);
    }

    @Test
    @DisplayName("Debe procesar plantilla por tipo con placeholders")
    void processTemplateByType_ShouldReplacePlaceholdersCorrectly() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "welcome-template",
            EmailTemplateType.WELCOME,
            "Welcome {{name}}",
            "<html>Hello {{name}}!</html>",
            "Welcome template"
        );
        templateService.saveTemplate(template);

        Map<String, String> placeholders = Map.of("name", "Jane Doe");

        // When
        String result = templateService.processTemplate(EmailTemplateType.WELCOME, placeholders);

        // Then
        assertEquals("<html>Hello Jane Doe!</html>", result);
    }

    @Test
    @DisplayName("Debe obtener el asunto de una plantilla por tipo")
    void getSubject_ShouldReturnCorrectSubject() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "welcome-template",
            EmailTemplateType.WELCOME,
            "Welcome to AdoptaFacil",
            "<html>Welcome content</html>",
            "Welcome template"
        );
        templateService.saveTemplate(template);

        // When
        String subject = templateService.getSubject(EmailTemplateType.WELCOME);

        // Then
        assertEquals("Welcome to AdoptaFacil", subject);
    }

    @Test
    @DisplayName("Debe verificar si existe plantilla activa para un tipo")
    void templateExists_ShouldReturnTrueForExistingActiveTemplate() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "welcome-template",
            EmailTemplateType.WELCOME,
            "Welcome Subject",
            "<html>Welcome content</html>",
            "Welcome template"
        );
        templateService.saveTemplate(template);

        // When & Then
        assertTrue(templateService.templateExists(EmailTemplateType.WELCOME));
        assertFalse(templateService.templateExists(EmailTemplateType.RECOVERY));
    }

    @Test
    @DisplayName("Debe devolver false para plantilla inactiva")
    void templateExists_ShouldReturnFalseForInactiveTemplate() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "welcome-template",
            EmailTemplateType.WELCOME,
            "Welcome Subject",
            "<html>Welcome content</html>",
            "Welcome template"
        );
        template.setActive(false);
        templateService.saveTemplate(template);

        // When & Then
        assertFalse(templateService.templateExists(EmailTemplateType.WELCOME));
    }

    @Test
    @DisplayName("Debe contar correctamente las plantillas activas")
    void getActiveTemplateCount_ShouldReturnCorrectCount() {
        // Given
        EmailTemplate activeTemplate1 = new EmailTemplate(
            "active-1",
            EmailTemplateType.WELCOME,
            "Subject 1",
            "<html>Content 1</html>",
            "Template 1"
        );

        EmailTemplate activeTemplate2 = new EmailTemplate(
            "active-2",
            EmailTemplateType.RECOVERY,
            "Subject 2",
            "<html>Content 2</html>",
            "Template 2"
        );

        EmailTemplate inactiveTemplate = new EmailTemplate(
            "inactive-1",
            EmailTemplateType.NOTIFICATION,
            "Subject 3",
            "<html>Content 3</html>",
            "Template 3"
        );
        inactiveTemplate.setActive(false);

        templateService.saveTemplate(activeTemplate1);
        templateService.saveTemplate(activeTemplate2);
        templateService.saveTemplate(inactiveTemplate);

        // When
        int count = templateService.getActiveTemplateCount();

        // Then
        assertEquals(2, count);
    }

    @Test
    @DisplayName("Debe lanzar excepción para plantilla no encontrada")
    void processTemplate_ShouldThrowExceptionForNonExistentTemplate() {
        // Given
        Map<String, String> placeholders = Map.of("name", "Test");

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> templateService.processTemplate("non-existent", placeholders)
        );
        assertTrue(exception.getMessage().contains("Plantilla no encontrada"));
    }

    @Test
    @DisplayName("Debe lanzar excepción para plantilla inactiva")
    void processTemplate_ShouldThrowExceptionForInactiveTemplate() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "inactive-template",
            EmailTemplateType.WELCOME,
            "Subject",
            "<html>Content</html>",
            "Template"
        );
        template.setActive(false);
        templateService.saveTemplate(template);

        Map<String, String> placeholders = Map.of("name", "Test");

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> templateService.processTemplate(EmailTemplateType.WELCOME, placeholders)
        );
        assertTrue(exception.getMessage().contains("Plantilla no encontrada o inactiva"));
    }

    @Test
    @DisplayName("Debe limpiar todas las plantillas")
    void clearAll_ShouldRemoveAllTemplates() {
        // Given
        EmailTemplate template1 = new EmailTemplate(
            "template-1",
            EmailTemplateType.WELCOME,
            "Subject 1",
            "<html>Content 1</html>",
            "Template 1"
        );

        EmailTemplate template2 = new EmailTemplate(
            "template-2",
            EmailTemplateType.RECOVERY,
            "Subject 2",
            "<html>Content 2</html>",
            "Template 2"
        );

        templateService.saveTemplate(template1);
        templateService.saveTemplate(template2);

        // Verify templates exist
        assertEquals(2, templateService.getActiveTemplateCount());

        // When
        templateService.clearAll();

        // Then
        assertEquals(0, templateService.getActiveTemplateCount());
        assertTrue(templateService.findAll().isEmpty());
    }
}