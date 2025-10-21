package com.example.demo.model;

import java.time.LocalDateTime;

/**
 * Modelo que representa una plantilla de email en el sistema.
 * Las plantillas contienen el contenido HTML y configuración para diferentes tipos de emails.
 */
public class EmailTemplate {

    private String id;
    private EmailTemplateType type;
    private String subject;
    private String htmlContent;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor vacío
    public EmailTemplate() {}

    // Constructor completo
    public EmailTemplate(String id, EmailTemplateType type, String subject,
                        String htmlContent, String description) {
        this.id = id;
        this.type = type;
        this.subject = subject;
        this.htmlContent = htmlContent;
        this.description = description;
        this.active = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public EmailTemplateType getType() {
        return type;
    }

    public void setType(EmailTemplateType type) {
        this.type = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Reemplaza placeholders en el contenido HTML con valores dinámicos.
     * @param placeholders Mapa de placeholders y sus valores
     * @return Contenido HTML con placeholders reemplazados
     */
    public String processTemplate(java.util.Map<String, String> placeholders) {
        String processedContent = this.htmlContent;
        for (java.util.Map.Entry<String, String> entry : placeholders.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            processedContent = processedContent.replace(placeholder, entry.getValue());
        }
        return processedContent;
    }

    @Override
    public String toString() {
        return "EmailTemplate{" +
                "id='" + id + '\'' +
                ", type=" + type +
                ", subject='" + subject + '\'' +
                ", description='" + description + '\'' +
                ", active=" + active +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        EmailTemplate that = (EmailTemplate) obj;
        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}