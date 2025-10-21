package com.example.demo.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("EmailTemplate Model Tests")
class EmailTemplateTest {

    @Test
    @DisplayName("Debe crear plantilla con constructor completo")
    void constructor_ShouldInitializeAllFields() {
        // Given
        String id = "test-template";
        EmailTemplateType type = EmailTemplateType.WELCOME;
        String subject = "Test Subject";
        String htmlContent = "<html>Test Content</html>";
        String description = "Test template description";

        // When
        EmailTemplate template = new EmailTemplate(id, type, subject, htmlContent, description);

        // Then
        assertEquals(id, template.getId());
        assertEquals(type, template.getType());
        assertEquals(subject, template.getSubject());
        assertEquals(htmlContent, template.getHtmlContent());
        assertEquals(description, template.getDescription());
        assertTrue(template.isActive());
        assertNotNull(template.getCreatedAt());
        assertNotNull(template.getUpdatedAt());
    }

    @Test
    @DisplayName("Debe procesar plantilla con placeholders simples")
    void processTemplate_ShouldReplaceSinglePlaceholder() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome {{name}}",
            "<html>Hello {{name}}!</html>",
            "Test template"
        );

        Map<String, String> placeholders = Map.of("name", "John Doe");

        // When
        String result = template.processTemplate(placeholders);

        // Then
        assertEquals("<html>Hello John Doe!</html>", result);
    }

    @Test
    @DisplayName("Debe procesar plantilla con múltiples placeholders")
    void processTemplate_ShouldReplaceMultiplePlaceholders() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome {{name}} to {{app}}",
            "<html>Hello {{name}}, welcome to {{app}}! Your token is {{token}}.</html>",
            "Test template"
        );

        Map<String, String> placeholders = Map.of(
            "name", "Jane Doe",
            "app", "AdoptaFacil",
            "token", "ABC123"
        );

        // When
        String result = template.processTemplate(placeholders);

        // Then
        assertEquals("<html>Hello Jane Doe, welcome to AdoptaFacil! Your token is ABC123.</html>", result);
    }

    @Test
    @DisplayName("Debe manejar placeholders no encontrados sin cambios")
    void processTemplate_ShouldLeaveUnmatchedPlaceholders() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome {{name}}",
            "<html>Hello {{name}} and {{unknown}}!</html>",
            "Test template"
        );

        Map<String, String> placeholders = Map.of("name", "John");

        // When
        String result = template.processTemplate(placeholders);

        // Then
        assertEquals("<html>Hello John and {{unknown}}!</html>", result);
    }

    @Test
    @DisplayName("Debe manejar mapa de placeholders vacío")
    void processTemplate_ShouldHandleEmptyPlaceholdersMap() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome {{name}}",
            "<html>Hello {{name}}!</html>",
            "Test template"
        );

        Map<String, String> placeholders = Map.of();

        // When
        String result = template.processTemplate(placeholders);

        // Then
        assertEquals("<html>Hello {{name}}!</html>", result);
    }

    @Test
    @DisplayName("Debe manejar placeholders con caracteres especiales")
    void processTemplate_ShouldHandleSpecialCharactersInPlaceholders() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome",
            "<html>Hello {{name}}! Your email is {{email}}.</html>",
            "Test template"
        );

        Map<String, String> placeholders = Map.of(
            "name", "José María",
            "email", "user@test.com"
        );

        // When
        String result = template.processTemplate(placeholders);

        // Then
        assertEquals("<html>Hello José María! Your email is user@test.com.</html>", result);
    }

    @Test
    @DisplayName("Debe activar/desactivar plantilla correctamente")
    void setActive_ShouldUpdateActiveStatusAndTimestamp() throws InterruptedException {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Subject",
            "<html>Content</html>",
            "Description"
        );
        LocalDateTime initialUpdateTime = template.getUpdatedAt();

        // Pequeño delay para asegurar diferencia de tiempo
        Thread.sleep(1);

        // When
        template.setActive(false);

        // Then
        assertFalse(template.isActive());
        assertTrue(template.getUpdatedAt().isAfter(initialUpdateTime));
    }

    @Test
    @DisplayName("Debe implementar equals correctamente por ID")
    void equals_ShouldCompareById() {
        // Given
        EmailTemplate template1 = new EmailTemplate("id1", EmailTemplateType.WELCOME, "Subject", "Content", "Desc");
        EmailTemplate template2 = new EmailTemplate("id1", EmailTemplateType.RECOVERY, "Subject2", "Content2", "Desc2");
        EmailTemplate template3 = new EmailTemplate("id2", EmailTemplateType.WELCOME, "Subject", "Content", "Desc");

        // Then
        assertEquals(template1, template2); // Mismo ID
        assertNotEquals(template1, template3); // Diferente ID
        assertNotEquals(template1, null);
        assertNotEquals(template1, "not a template");
    }

    @Test
    @DisplayName("Debe implementar hashCode consistentemente")
    void hashCode_ShouldBeConsistentWithEquals() {
        // Given
        EmailTemplate template1 = new EmailTemplate("id1", EmailTemplateType.WELCOME, "Subject", "Content", "Desc");
        EmailTemplate template2 = new EmailTemplate("id1", EmailTemplateType.RECOVERY, "Subject2", "Content2", "Desc2");

        // Then
        assertEquals(template1.hashCode(), template2.hashCode());
    }

    @Test
    @DisplayName("Debe manejar ID nulo en equals y hashCode")
    void equalsAndHashCode_ShouldHandleNullId() {
        // Given
        EmailTemplate template1 = new EmailTemplate(null, EmailTemplateType.WELCOME, "Subject", "Content", "Desc");
        EmailTemplate template2 = new EmailTemplate(null, EmailTemplateType.RECOVERY, "Subject2", "Content2", "Desc2");

        // Then
        assertEquals(template1, template2);
        assertEquals(template1.hashCode(), template2.hashCode());
    }

    @Test
    @DisplayName("Debe generar toString informativo")
    void toString_ShouldReturnInformativeString() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Welcome Subject",
            "<html>Content</html>",
            "Test description"
        );

        // When
        String toString = template.toString();

        // Then
        assertTrue(toString.contains("test-template"));
        assertTrue(toString.contains("welcome"));
        assertTrue(toString.contains("Welcome Subject"));
        assertTrue(toString.contains("Test description"));
        assertTrue(toString.contains("true")); // active
    }

    @Test
    @DisplayName("Debe permitir configuración manual de timestamps")
    void setCreatedAtAndUpdatedAt_ShouldWorkCorrectly() {
        // Given
        EmailTemplate template = new EmailTemplate(
            "test-template",
            EmailTemplateType.WELCOME,
            "Subject",
            "Content",
            "Description"
        );
        LocalDateTime customTime = LocalDateTime.of(2023, 1, 1, 12, 0);

        // When
        template.setCreatedAt(customTime);
        template.setUpdatedAt(customTime);

        // Then
        assertEquals(customTime, template.getCreatedAt());
        assertEquals(customTime, template.getUpdatedAt());
    }
}