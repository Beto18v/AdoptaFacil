package com.example.demo.service;

import com.example.demo.dto.WelcomeEmailRequest;
import com.example.demo.model.EmailTemplateType;
import com.example.demo.strategy.WelcomeEmailStrategy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import jakarta.mail.internet.MimeMessage;

import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private EmailTemplateService templateService;

    @InjectMocks
    private EmailService emailService;

    @Test
    void testSendWelcomeEmail() throws Exception {
        // Arrange
        ReflectionTestUtils.setField(emailService, "mailUsername", "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@example.com", "John Doe");
        MimeMessage mimeMessage = mock(MimeMessage.class);

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateService.getSubject(EmailTemplateType.WELCOME)).thenReturn("Welcome Subject");
        when(templateService.processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class)))
            .thenReturn("<html>Welcome content</html>");

        // Act
        emailService.sendWelcomeEmail(request);

        // Assert
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
        verify(templateService).getSubject(EmailTemplateType.WELCOME);
        verify(templateService).processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class));
    }

    @Test
    void testSendEmailWithStrategy() throws Exception {
        // Arrange
        ReflectionTestUtils.setField(emailService, "mailUsername", "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@example.com", "John Doe");
        WelcomeEmailStrategy strategy = new WelcomeEmailStrategy(templateService);
        MimeMessage mimeMessage = mock(MimeMessage.class);

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateService.getSubject(EmailTemplateType.WELCOME)).thenReturn("Welcome Subject");
        when(templateService.processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class)))
            .thenReturn("<html>Welcome content</html>");

        // Act
        emailService.sendEmail(strategy, request);

        // Assert
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
        verify(templateService).getSubject(EmailTemplateType.WELCOME);
        verify(templateService).processTemplate(eq(EmailTemplateType.WELCOME), any(Map.class));
    }
}