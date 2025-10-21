package com.example.demo.controller;

import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.service.EmailService;
import com.example.demo.service.PasswordResetService;
import com.example.demo.service.UserApiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class RecoveryEmailControllerTest {

    @Mock
    private EmailService emailService;

    @Mock
    private UserApiService userApiService;

    @Mock
    private PasswordResetService passwordResetService;

    @InjectMocks
    private RecoveryEmailController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void forgotPassword_ValidEmail_ShouldReturnSuccess() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("test@example.com");
        when(userApiService.validateEmail("test@example.com")).thenReturn(true);
        when(passwordResetService.generateToken("test@example.com")).thenReturn("123456");
        doNothing().when(emailService).sendRecoveryEmail(any());

        ResponseEntity<String> response = controller.forgotPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Se ha enviado un código de recuperación a tu email.", response.getBody());
        verify(emailService).sendRecoveryEmail(any());
    }

    @Test
    void forgotPassword_InvalidEmail_ShouldReturnBadRequest() {
        ForgotPasswordRequest request = new ForgotPasswordRequest("invalid@example.com");
        when(userApiService.validateEmail("invalid@example.com")).thenReturn(false);

        ResponseEntity<String> response = controller.forgotPassword(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("El email no está registrado en el sistema.", response.getBody());
    }

    @Test
    void resetPassword_ValidRequest_ShouldReturnSuccess() {
        ResetPasswordRequest request = new ResetPasswordRequest("test@example.com", "123456", "newPass123", "newPass123");
        when(passwordResetService.validateToken("test@example.com", "123456")).thenReturn(true);
        when(userApiService.resetPassword("test@example.com", "newPass123")).thenReturn(true);

        ResponseEntity<String> response = controller.resetPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Contraseña actualizada exitosamente.", response.getBody());
        verify(passwordResetService).removeToken("test@example.com");
    }

    @Test
    void resetPassword_PasswordsDontMatch_ShouldReturnBadRequest() {
        ResetPasswordRequest request = new ResetPasswordRequest("test@example.com", "123456", "newPass123", "differentPass");

        ResponseEntity<String> response = controller.resetPassword(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Las contraseñas no coinciden.", response.getBody());
    }

    @Test
    void resetPassword_InvalidToken_ShouldReturnBadRequest() {
        ResetPasswordRequest request = new ResetPasswordRequest("test@example.com", "123456", "newPass123", "newPass123");
        when(passwordResetService.validateToken("test@example.com", "123456")).thenReturn(false);

        ResponseEntity<String> response = controller.resetPassword(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Token inválido o expirado.", response.getBody());
    }
}