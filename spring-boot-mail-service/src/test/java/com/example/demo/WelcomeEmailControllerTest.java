package com.example.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mail.MailException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WelcomeEmailController.class)
class WelcomeEmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void sendWelcomeEmail_ShouldReturnSuccess_WhenEmailSent() throws Exception {
        // Given
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@test.com", "John Doe");
        doNothing().when(emailService).sendWelcomeEmail(request);

        // When & Then
        mockMvc.perform(post("/api/send-welcome-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Email de bienvenida enviado exitosamente a user@test.com"));

        verify(emailService).sendWelcomeEmail(request);
    }

    @Test
    void sendWelcomeEmail_ShouldReturnInternalServerError_WhenMailException() throws Exception {
        // Given
        WelcomeEmailRequest request = new WelcomeEmailRequest("user@test.com", "John Doe");
        doThrow(new MailException("SMTP error") {}).when(emailService).sendWelcomeEmail(request);

        // When & Then
        mockMvc.perform(post("/api/send-welcome-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error al enviar el email: SMTP error"));

        verify(emailService).sendWelcomeEmail(request);
    }

    @Test
    void sendWelcomeEmail_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Given
        String invalidJson = "{\"email\": \"invalid-email\", \"name\": \"\"}";

        // When & Then
        mockMvc.perform(post("/api/send-welcome-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sendWelcomeEmail_ShouldReturnBadRequest_WhenEmptyBody() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/send-welcome-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }
}