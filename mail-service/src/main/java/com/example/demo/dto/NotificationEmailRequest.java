package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class NotificationEmailRequest implements EmailRequest {
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El mensaje es obligatorio")
    private String message;

    public NotificationEmailRequest() {
    }

    public NotificationEmailRequest(String email, String name, String message) {
        this.email = email;
        this.name = name;
        this.message = message;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}