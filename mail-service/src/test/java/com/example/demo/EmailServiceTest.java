package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @Test
    void sendWelcomeEmail_ShouldSendCorrectMessage() {
        // Given
        emailService = new EmailService(mailSender, "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@test.com", "John Doe");
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // When
        emailService.sendWelcomeEmail(request);

        // Then
        verify(mailSender).send(messageCaptor.capture());
        SimpleMailMessage sentMessage = messageCaptor.getValue();

        assertEquals("test@example.com", sentMessage.getFrom());
        assertArrayEquals(new String[]{"user@test.com"}, sentMessage.getTo());
        assertEquals("Bienvenido a nuestra plataforma", sentMessage.getSubject());
        assertTrue(sentMessage.getText().contains("Hola John Doe"));
        assertTrue(sentMessage.getText().contains("Bienvenido a AdoptaFacil"));
    }

    @Test
    void sendWelcomeEmail_ShouldHandleNullRequest() {
        // Given
        emailService = new EmailService(mailSender, "test@example.com");
        WelcomeEmailRequest request = new WelcomeEmailRequest(null, null);

        // When & Then
        assertDoesNotThrow(() -> emailService.sendWelcomeEmail(request));
        verify(mailSender).send(any(SimpleMailMessage.class));
    }
}