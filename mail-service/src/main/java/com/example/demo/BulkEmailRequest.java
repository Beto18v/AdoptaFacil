package com.example.demo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class BulkEmailRequest {
    @NotEmpty(message = "La lista de emails no puede estar vacía")
    private List<String> emails;

    @NotBlank(message = "El asunto es obligatorio")
    private String subject;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    public BulkEmailRequest() {
    }

    public BulkEmailRequest(List<String> emails, String subject, String description) {
        this.emails = emails;
        this.subject = subject;
        this.description = description;
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}