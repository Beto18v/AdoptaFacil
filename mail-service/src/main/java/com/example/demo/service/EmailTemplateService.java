package com.example.demo.service;

import com.example.demo.model.EmailTemplate;
import com.example.demo.model.EmailTemplateType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio para gestionar las plantillas de email.
 * Proporciona métodos para almacenar, recuperar y procesar plantillas.
 */
@Service
public class EmailTemplateService {

    // Almacenamiento en memoria usando ConcurrentHashMap para thread-safety
    private final Map<String, EmailTemplate> templates = new ConcurrentHashMap<>();
    private final Map<EmailTemplateType, String> typeToIdMapping = new ConcurrentHashMap<>();

    /**
     * Guarda una plantilla en el almacenamiento.
     * @param template Plantilla a guardar
     */
    public void saveTemplate(EmailTemplate template) {
        templates.put(template.getId(), template);
        typeToIdMapping.put(template.getType(), template.getId());
    }

    /**
     * Busca una plantilla por su ID.
     * @param id ID de la plantilla
     * @return Optional con la plantilla si existe
     */
    public Optional<EmailTemplate> findById(String id) {
        return Optional.ofNullable(templates.get(id));
    }

    /**
     * Busca una plantilla por su tipo.
     * @param type Tipo de plantilla
     * @return Optional con la plantilla si existe
     */
    public Optional<EmailTemplate> findByType(EmailTemplateType type) {
        String templateId = typeToIdMapping.get(type);
        return templateId != null ? findById(templateId) : Optional.empty();
    }

    /**
     * Obtiene todas las plantillas activas.
     * @return Lista de plantillas activas
     */
    public List<EmailTemplate> findAllActive() {
        return templates.values().stream()
                .filter(EmailTemplate::isActive)
                .toList();
    }

    /**
     * Obtiene todas las plantillas.
     * @return Lista de todas las plantillas
     */
    public List<EmailTemplate> findAll() {
        return List.copyOf(templates.values());
    }

    /**
     * Procesa una plantilla con los placeholders proporcionados.
     * @param templateId ID de la plantilla
     * @param placeholders Mapa de placeholders y sus valores
     * @return Contenido HTML procesado
     * @throws IllegalArgumentException si la plantilla no existe o no está activa
     */
    public String processTemplate(String templateId, Map<String, String> placeholders) {
        EmailTemplate template = findById(templateId)
                .filter(EmailTemplate::isActive)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Plantilla no encontrada o inactiva: " + templateId));

        return template.processTemplate(placeholders);
    }

    /**
     * Procesa una plantilla por tipo con los placeholders proporcionados.
     * @param type Tipo de plantilla
     * @param placeholders Mapa de placeholders y sus valores
     * @return Contenido HTML procesado
     * @throws IllegalArgumentException si la plantilla no existe o no está activa
     */
    public String processTemplate(EmailTemplateType type, Map<String, String> placeholders) {
        EmailTemplate template = findByType(type)
                .filter(EmailTemplate::isActive)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Plantilla no encontrada o inactiva para tipo: " + type));

        return template.processTemplate(placeholders);
    }

    /**
     * Obtiene el asunto de una plantilla por tipo.
     * @param type Tipo de plantilla
     * @return Asunto de la plantilla
     * @throws IllegalArgumentException si la plantilla no existe o no está activa
     */
    public String getSubject(EmailTemplateType type) {
        EmailTemplate template = findByType(type)
                .filter(EmailTemplate::isActive)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Plantilla no encontrada o inactiva para tipo: " + type));

        return template.getSubject();
    }

    /**
     * Verifica si existe una plantilla activa para el tipo especificado.
     * @param type Tipo de plantilla
     * @return true si existe y está activa
     */
    public boolean templateExists(EmailTemplateType type) {
        return findByType(type)
                .map(EmailTemplate::isActive)
                .orElse(false);
    }

    /**
     * Desactiva una plantilla por su ID.
     * @param templateId ID de la plantilla
     * @return true si se desactivó correctamente
     */
    public boolean deactivateTemplate(String templateId) {
        Optional<EmailTemplate> templateOpt = findById(templateId);
        if (templateOpt.isPresent()) {
            EmailTemplate template = templateOpt.get();
            template.setActive(false);
            return true;
        }
        return false;
    }

    /**
     * Obtiene el número total de plantillas activas.
     * @return Número de plantillas activas
     */
    public int getActiveTemplateCount() {
        return (int) templates.values().stream()
                .filter(EmailTemplate::isActive)
                .count();
    }

    /**
     * Limpia todas las plantillas (útil para testing).
     */
    public void clearAll() {
        templates.clear();
        typeToIdMapping.clear();
    }
}