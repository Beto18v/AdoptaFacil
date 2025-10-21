package com.example.demo.strategy;

import com.example.demo.dto.WelcomeEmailRequest;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.service.EmailTemplateService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WelcomeEmailStrategyTest {

    @Mock
    private EmailTemplateService templateService;

    @Test
    void testSendEmail() throws Exception {
        // Arrange
        WelcomeEmailStrategy strategy = new WelcomeEmailStrategy(templateService);
        WelcomeEmailRequest request = new WelcomeEmailRequest("test@example.com", "John Doe");
        MimeMessage message = mock(MimeMessage.class);
        MimeMessageHelper helper = mock(MimeMessageHelper.class);

        when(templateService.getSubject(EmailTemplateType.WELCOME)).thenReturn("Welcome Subject");
        when(templateService.processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class)))
            .thenReturn("<html>Welcome John Doe!</html>");

        // Act
        strategy.sendEmail(request, message);

        // Assert
        verify(templateService).getSubject(EmailTemplateType.WELCOME);
        verify(templateService).processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class));

        // Verify the placeholders map contains the expected values
        verify(templateService).processTemplate(
            eq(EmailTemplateType.WELCOME),
            argThat((Map<String, String> placeholders) ->
                "John Doe".equals(placeholders.get("name"))
            )
        );
    }

    @Test
    void testSendEmailWithDifferentName() throws Exception {
        // Arrange
        WelcomeEmailStrategy strategy = new WelcomeEmailStrategy(templateService);
        WelcomeEmailRequest request = new WelcomeEmailRequest("jane@example.com", "Jane Smith");
        MimeMessage message = mock(MimeMessage.class);

        when(templateService.getSubject(EmailTemplateType.WELCOME)).thenReturn("Welcome Subject");
        when(templateService.processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class)))
            .thenReturn("<html>Welcome Jane Smith!</html>");

        // Act
        strategy.sendEmail(request, message);

        // Assert
        verify(templateService).processTemplate(
            eq(EmailTemplateType.WELCOME),
            argThat((Map<String, String> placeholders) ->
                "Jane Smith".equals(placeholders.get("name"))
            )
        );
    }

    @Test
    void testConstructorRequiresTemplateService() {
        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            new WelcomeEmailStrategy(null);
        });
    }
}