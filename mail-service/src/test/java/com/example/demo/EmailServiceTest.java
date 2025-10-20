package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.internet.MimeMessage;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    private EmailService emailService;

    @Test
    void sendWelcomeEmail_ShouldSendCorrectMessage() throws Exception {
        // Given
        emailService = new EmailService(mailSender, "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@test.com", "John Doe");

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // When
        emailService.sendWelcomeEmail(request);

        // Then
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendWelcomeEmail_ShouldHandleValidRequest() throws Exception {
        // Given
        emailService = new EmailService(mailSender, "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("valid@test.com", "Valid User");

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // When & Then
        assertDoesNotThrow(() -> emailService.sendWelcomeEmail(request));
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendBulkEmail_ShouldSendToMultipleRecipients() throws Exception {
        // Given
        emailService = new EmailService(mailSender, "test@example.com");
        BulkEmailRequest request = new BulkEmailRequest(
            List.of("user1@test.com", "user2@test.com"),
            "Test Subject",
            "Test Description"
        );

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // When
        emailService.sendBulkEmail(request);

        // Then
        verify(mailSender, times(2)).send(mimeMessage);
    }
}