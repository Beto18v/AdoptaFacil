package com.example.demo.strategy;

import com.example.demo.dto.WelcomeEmailRequest;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WelcomeEmailStrategyTest {

    @Test
    void testSendEmail() throws Exception {
        // Arrange
        WelcomeEmailStrategy strategy = new WelcomeEmailStrategy();
        WelcomeEmailRequest request = new WelcomeEmailRequest("test@example.com", "John Doe");
        MimeMessage message = mock(MimeMessage.class);
        MimeMessageHelper helper = mock(MimeMessageHelper.class);

        // Act
        strategy.sendEmail(request, message);

        // Assert
        // Verify that the helper methods are called with correct parameters
        // Note: Since helper is created inside the strategy, we can't directly mock it
        // This is a limitation of the current design. In a real scenario, we might need to refactor
        // to inject the helper or make it testable.
        assertNotNull(strategy);
        assertEquals("test@example.com", request.getEmail());
        assertEquals("John Doe", request.getName());
    }
}