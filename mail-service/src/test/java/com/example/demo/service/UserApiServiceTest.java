package com.example.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserApiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private UserApiService userApiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Set the properties manually since @Value doesn't work in unit tests
        ReflectionTestUtils.setField(userApiService, "laravelApiBaseUrl", "http://localhost:8000/api");
        ReflectionTestUtils.setField(userApiService, "usersEndpoint", "/users");
        ReflectionTestUtils.setField(userApiService, "resetPasswordEndpoint", "/users/reset-password");
    }

    @Test
    void validateEmail_ValidEmail_ShouldReturnTrue() {
        String email = "test@example.com";
        Map<String, Object> responseBody = Map.of("valid", true);
        ResponseEntity<Map> response = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(response);

        boolean result = userApiService.validateEmail(email);

        assertTrue(result);
        verify(restTemplate).postForEntity(
            eq("http://localhost:8000/api/users/validate-email"),
            eq(Map.of("email", email)),
            eq(Map.class)
        );
    }

    @Test
    void validateEmail_InvalidEmail_ShouldReturnFalse() {
        String email = "invalid@example.com";
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class)))
            .thenThrow(new RuntimeException("Not found"));

        boolean result = userApiService.validateEmail(email);

        assertFalse(result);
    }

    @Test
    void resetPassword_Success_ShouldReturnTrue() {
        String email = "test@example.com";
        String password = "newPassword123";
        ResponseEntity<Map> response = new ResponseEntity<>(HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(response);

        boolean result = userApiService.resetPassword(email, password);

        assertTrue(result);
        verify(restTemplate).postForEntity(
            eq("http://localhost:8000/api/users/reset-password"),
            eq(Map.of("email", email, "password", password)),
            eq(Map.class)
        );
    }

    @Test
    void resetPassword_Failure_ShouldReturnFalse() {
        String email = "test@example.com";
        String password = "newPassword123";
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class)))
            .thenThrow(new RuntimeException("Error"));

        boolean result = userApiService.resetPassword(email, password);

        assertFalse(result);
    }
}