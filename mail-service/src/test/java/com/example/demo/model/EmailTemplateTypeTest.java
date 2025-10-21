package com.example.demo.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("EmailTemplateType Enum Tests")
class EmailTemplateTypeTest {

    @Test
    @DisplayName("Debe tener los tres tipos de plantilla definidos")
    void values_ShouldContainAllTemplateTypes() {
        // When
        EmailTemplateType[] values = EmailTemplateType.values();

        // Then
        assertEquals(3, values.length);
        assertTrue(containsType(values, EmailTemplateType.WELCOME));
        assertTrue(containsType(values, EmailTemplateType.RECOVERY));
        assertTrue(containsType(values, EmailTemplateType.NOTIFICATION));
    }

    @Test
    @DisplayName("WELCOME debe tener código y descripción correctos")
    void welcome_ShouldHaveCorrectCodeAndDescription() {
        // Given
        EmailTemplateType welcome = EmailTemplateType.WELCOME;

        // Then
        assertEquals("welcome", welcome.getCode());
        assertEquals("Email de bienvenida para nuevos usuarios", welcome.getDescription());
    }

    @Test
    @DisplayName("RECOVERY debe tener código y descripción correctos")
    void recovery_ShouldHaveCorrectCodeAndDescription() {
        // Given
        EmailTemplateType recovery = EmailTemplateType.RECOVERY;

        // Then
        assertEquals("recovery", recovery.getCode());
        assertEquals("Email de recuperación de contraseña", recovery.getDescription());
    }

    @Test
    @DisplayName("NOTIFICATION debe tener código y descripción correctos")
    void notification_ShouldHaveCorrectCodeAndDescription() {
        // Given
        EmailTemplateType notification = EmailTemplateType.NOTIFICATION;

        // Then
        assertEquals("notification", notification.getCode());
        assertEquals("Email de notificaciones generales", notification.getDescription());
    }

    @Test
    @DisplayName("fromCode debe devolver el tipo correcto para códigos válidos")
    void fromCode_ShouldReturnCorrectTypeForValidCodes() {
        // When & Then
        assertEquals(EmailTemplateType.WELCOME, EmailTemplateType.fromCode("welcome"));
        assertEquals(EmailTemplateType.RECOVERY, EmailTemplateType.fromCode("recovery"));
        assertEquals(EmailTemplateType.NOTIFICATION, EmailTemplateType.fromCode("notification"));
    }

    @Test
    @DisplayName("fromCode debe devolver null para códigos inválidos")
    void fromCode_ShouldReturnNullForInvalidCodes() {
        // When & Then
        assertNull(EmailTemplateType.fromCode("invalid"));
        assertNull(EmailTemplateType.fromCode(""));
        assertNull(EmailTemplateType.fromCode(null));
        assertNull(EmailTemplateType.fromCode("WELCOME")); // Case sensitive
    }

    @Test
    @DisplayName("fromCode debe manejar códigos con mayúsculas y minúsculas")
    void fromCode_ShouldBeCaseSensitive() {
        // When & Then
        assertNull(EmailTemplateType.fromCode("WELCOME"));
        assertNull(EmailTemplateType.fromCode("Recovery"));
        assertNull(EmailTemplateType.fromCode("NOTIFICATION"));
    }

    @Test
    @DisplayName("toString debe devolver el código del tipo")
    void toString_ShouldReturnCode() {
        // When & Then
        assertEquals("welcome", EmailTemplateType.WELCOME.toString());
        assertEquals("recovery", EmailTemplateType.RECOVERY.toString());
        assertEquals("notification", EmailTemplateType.NOTIFICATION.toString());
    }

    @Test
    @DisplayName("Cada tipo debe ser único en el enum")
    void eachType_ShouldBeUnique() {
        // Given
        EmailTemplateType[] values = EmailTemplateType.values();

        // Then
        for (EmailTemplateType type : values) {
            long count = java.util.Arrays.stream(values)
                    .filter(t -> t == type)
                    .count();
            assertEquals(1, count, "Tipo " + type + " no es único");
        }
    }

    @Test
    @DisplayName("Códigos deben ser únicos")
    void codes_ShouldBeUnique() {
        // Given
        EmailTemplateType[] values = EmailTemplateType.values();

        // Then
        for (EmailTemplateType type : values) {
            long count = java.util.Arrays.stream(values)
                    .filter(t -> t.getCode().equals(type.getCode()))
                    .count();
            assertEquals(1, count, "Código " + type.getCode() + " no es único");
        }
    }

    @Test
    @DisplayName("Descripciones deben ser informativas y únicas")
    void descriptions_ShouldBeUniqueAndInformative() {
        // Given
        EmailTemplateType[] values = EmailTemplateType.values();

        // Then
        for (EmailTemplateType type : values) {
            // Verificar que la descripción no esté vacía
            assertNotNull(type.getDescription());
            assertFalse(type.getDescription().trim().isEmpty());

            // Verificar que sea única
            long count = java.util.Arrays.stream(values)
                    .filter(t -> t.getDescription().equals(type.getDescription()))
                    .count();
            assertEquals(1, count, "Descripción '" + type.getDescription() + "' no es única");
        }
    }

    // Método auxiliar para verificar si un array contiene un tipo específico
    private boolean containsType(EmailTemplateType[] array, EmailTemplateType type) {
        for (EmailTemplateType t : array) {
            if (t == type) {
                return true;
            }
        }
        return false;
    }
}