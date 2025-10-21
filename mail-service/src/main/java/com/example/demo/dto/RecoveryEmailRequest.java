package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RecoveryEmailRequest implements EmailRequest {
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El token es obligatorio")
    private String token;

    public RecoveryEmailRequest() {
    }

    public RecoveryEmailRequest(String email, String name, String token) {
        this.email = email;
        this.name = name;
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}