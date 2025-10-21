package com.example.demo.model;

/**
 * Enum que define los tipos de plantillas de email disponibles en el sistema.
 */
public enum EmailTemplateType {
    WELCOME("welcome", "Email de bienvenida para nuevos usuarios"),
    RECOVERY("recovery", "Email de recuperación de contraseña"),
    NOTIFICATION("notification", "Email de notificaciones generales");

    private final String code;
    private final String description;

    EmailTemplateType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Busca un tipo de plantilla por su código.
     * @param code Código del tipo de plantilla
     * @return EmailTemplateType correspondiente o null si no se encuentra
     */
    public static EmailTemplateType fromCode(String code) {
        for (EmailTemplateType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return code;
    }
}