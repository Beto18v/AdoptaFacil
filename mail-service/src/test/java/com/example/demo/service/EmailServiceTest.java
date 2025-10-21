package com.example.demo.service;

import com.example.demo.dto.WelcomeEmailRequest;
import com.example.demo.strategy.WelcomeEmailStrategy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import jakarta.mail.internet.MimeMessage;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void testSendWelcomeEmail() throws Exception {
        // Arrange
        ReflectionTestUtils.setField(emailService, "mailUsername", "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@example.com", "John Doe");
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Act
        emailService.sendWelcomeEmail(request);

        // Assert
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void testSendEmailWithStrategy() throws Exception {
        // Arrange
        ReflectionTestUtils.setField(emailService, "mailUsername", "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@example.com", "John Doe");
        WelcomeEmailStrategy strategy = new WelcomeEmailStrategy();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Act
        emailService.sendEmail(strategy, request);

        // Assert
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }
}