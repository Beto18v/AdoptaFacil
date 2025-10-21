package com.example.demo.seeder;

import com.example.demo.model.EmailTemplateType;
import com.example.demo.service.EmailTemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("EmailTemplateSeeder Tests")
class EmailTemplateSeederTest {

    @Mock
    private EmailTemplateService templateService;

    private EmailTemplateSeeder seeder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        seeder = new EmailTemplateSeeder(templateService);
    }

    @Test
    @DisplayName("Debe inicializar todas las plantillas al ejecutar run()")
    void run_ShouldInitializeAllTemplates() throws Exception {
        // Given - Configurar mocks para que indiquen que las plantillas no existen
        when(templateService.templateExists(EmailTemplateType.WELCOME)).thenReturn(false);
        when(templateService.templateExists(EmailTemplateType.RECOVERY)).thenReturn(false);
        when(templateService.templateExists(EmailTemplateType.NOTIFICATION)).thenReturn(false);

        // When
        seeder.run();

        // Then - Verificar que se guardaron las 3 plantillas
        verify(templateService, times(3)).saveTemplate(any()); // Una vez por cada tipo

        // Verificar que se consultó el conteo final
        verify(templateService, times(1)).getActiveTemplateCount();
    }

    @Test
    @DisplayName("No debe crear plantilla de bienvenida si ya existe")
    void run_ShouldSkipWelcomeTemplateIfExists() throws Exception {
        // Given
        when(templateService.templateExists(EmailTemplateType.WELCOME)).thenReturn(true);
        when(templateService.templateExists(EmailTemplateType.RECOVERY)).thenReturn(false);
        when(templateService.templateExists(EmailTemplateType.NOTIFICATION)).thenReturn(false);

        // When
        seeder.run();

        // Then - Solo debe guardar 2 plantillas (recovery y notification)
        verify(templateService, times(2)).saveTemplate(any());
    }

    @Test
    @DisplayName("No debe crear plantilla de recuperación si ya existe")
    void run_ShouldSkipRecoveryTemplateIfExists() throws Exception {
        // Given
        when(templateService.templateExists(EmailTemplateType.WELCOME)).thenReturn(false);
        when(templateService.templateExists(EmailTemplateType.RECOVERY)).thenReturn(true);
        when(templateService.templateExists(EmailTemplateType.NOTIFICATION)).thenReturn(false);

        // When
        seeder.run();

        // Then - Solo debe guardar 2 plantillas (welcome y notification)
        verify(templateService, times(2)).saveTemplate(any());
    }

    @Test
    @DisplayName("No debe crear plantilla de notificación si ya existe")
    void run_ShouldSkipNotificationTemplateIfExists() throws Exception {
        // Given
        when(templateService.templateExists(EmailTemplateType.WELCOME)).thenReturn(false);
        when(templateService.templateExists(EmailTemplateType.RECOVERY)).thenReturn(false);
        when(templateService.templateExists(EmailTemplateType.NOTIFICATION)).thenReturn(true);

        // When
        seeder.run();

        // Then - Solo debe guardar 2 plantillas (welcome y recovery)
        verify(templateService, times(2)).saveTemplate(any());
    }

    @Test
    @DisplayName("No debe crear ninguna plantilla si todas existen")
    void run_ShouldSkipAllTemplatesIfAllExist() throws Exception {
        // Given
        when(templateService.templateExists(EmailTemplateType.WELCOME)).thenReturn(true);
        when(templateService.templateExists(EmailTemplateType.RECOVERY)).thenReturn(true);
        when(templateService.templateExists(EmailTemplateType.NOTIFICATION)).thenReturn(true);

        // When
        seeder.run();

        // Then - No debe guardar ninguna plantilla
        verify(templateService, never()).saveTemplate(any());
    }

    @Test
    @DisplayName("Debe manejar argumentos de línea de comandos sin problemas")
    void run_ShouldHandleCommandLineArguments() throws Exception {
        // Given
        when(templateService.templateExists(any(EmailTemplateType.class))).thenReturn(false);
        String[] args = {"--spring.profiles.active=test", "--server.port=8081"};

        // When
        seeder.run(args);

        // Then - Debe funcionar sin problemas
        verify(templateService, times(3)).saveTemplate(any());
    }

    @Test
    @DisplayName("Debe manejar array de argumentos vacío")
    void run_ShouldHandleEmptyArgumentsArray() throws Exception {
        // Given
        when(templateService.templateExists(any(EmailTemplateType.class))).thenReturn(false);
        String[] args = {};

        // When
        seeder.run(args);

        // Then - Debe funcionar sin problemas
        verify(templateService, times(3)).saveTemplate(any());
    }

    @Test
    @DisplayName("Debe manejar array de argumentos nulo")
    void run_ShouldHandleNullArgumentsArray() throws Exception {
        // Given
        when(templateService.templateExists(any(EmailTemplateType.class))).thenReturn(false);
        String[] args = null;

        // When
        seeder.run(args);

        // Then - Debe funcionar sin problemas
        verify(templateService, times(3)).saveTemplate(any());
    }
}