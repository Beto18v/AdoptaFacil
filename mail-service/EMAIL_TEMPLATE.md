# Sistema de Plantillas de Email - AdoptaFacil

## 📋 Descripción General

Este documento describe el sistema de plantillas de email implementado en el servicio de emails de AdoptaFacil. El sistema permite gestionar plantillas HTML reutilizables con placeholders dinámicos para personalizar el contenido de los emails.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

#### 1. **EmailTemplate** (Modelo)
Entidad que representa una plantilla de email con los siguientes campos:
- `id`: Identificador único de la plantilla
- `type`: Tipo de plantilla (WELCOME, RECOVERY, NOTIFICATION)
- `subject`: Asunto del email
- `htmlContent`: Contenido HTML con placeholders
- `description`: Descripción de la plantilla
- `active`: Estado de activación
- `createdAt/updatedAt`: Timestamps de auditoría

#### 2. **EmailTemplateType** (Enum)
Define los tipos de plantillas disponibles:
- `WELCOME`: Emails de bienvenida para nuevos usuarios
- `RECOVERY`: Emails de recuperación de contraseña
- `NOTIFICATION`: Emails de notificaciones generales

#### 3. **EmailTemplateService** (Servicio)
Servicio principal que gestiona las plantillas:
- Almacenamiento en memoria (ConcurrentHashMap)
- Búsqueda por ID y tipo
- Procesamiento de placeholders
- Gestión del estado activo/inactivo

#### 4. **EmailTemplateSeeder** (Seeder)
Componente que inicializa las plantillas predeterminadas al iniciar la aplicación.

## 🔄 Flujo de Funcionamiento

```
1. Inicio de aplicación
   ↓
2. EmailTemplateSeeder ejecuta run()
   ↓
3. Se crean las 3 plantillas predeterminadas
   ↓
4. EmailService recibe petición
   ↓
5. Estrategia consulta EmailTemplateService
   ↓
6. Se obtiene asunto y contenido de plantilla
   ↓
7. Se procesan placeholders con datos dinámicos
   ↓
8. Se envía email personalizado
```

## 📝 Uso del Sistema

### 1. **Inicialización Automática**
Las plantillas se inicializan automáticamente al iniciar la aplicación gracias al `EmailTemplateSeeder`:

```java
@Component
public class EmailTemplateSeeder implements CommandLineRunner {
    // Se ejecuta automáticamente al iniciar Spring Boot
}
```

### 2. **Uso en Estrategias**
Las estrategias ahora usan el servicio de plantillas:

```java
public class WelcomeEmailStrategy implements EmailStrategy {
    private final EmailTemplateService templateService;

    @Override
    public void sendEmail(EmailRequest request, MimeMessage message) throws Exception {
        // Obtener asunto de plantilla
        String subject = templateService.getSubject(EmailTemplateType.WELCOME);
        helper.setSubject(subject);

        // Preparar placeholders
        Map<String, String> placeholders = Map.of("name", request.getName());

        // Procesar plantilla
        String htmlContent = templateService.processTemplate(EmailTemplateType.WELCOME, placeholders);
        helper.setText(htmlContent, true);
    }
}
```

### 3. **Placeholders Disponibles**

#### Email de Bienvenida
- `{{name}}`: Nombre del usuario

#### Email de Recuperación
- `{{name}}`: Nombre del usuario
- `{{token}}`: Token de recuperación

#### Email de Notificación
- `{{name}}`: Nombre del usuario
- `{{message}}`: Mensaje personalizado (con saltos de línea convertidos a `<br>`)

## 🎨 Características de las Plantillas

### Diseño Responsivo
Todas las plantillas incluyen:
- Media queries para dispositivos móviles
- Diseño adaptable que funciona en desktop y móvil
- Fuentes web seguras (Arial, sans-serif)

### Elementos Visuales
- Logo de AdoptaFacil desde Cloudinary
- Gradientes consistentes
- Paleta de colores corporativa
- Iconos y elementos decorativos

### Accesibilidad
- Contraste adecuado de colores
- Texto alternativo en imágenes
- Estructura semántica HTML

## 🧪 Testing

### Cobertura de Tests
- **EmailTemplateServiceTest**: Tests unitarios del servicio
- **EmailTemplateSeederTest**: Tests del seeder con mocks
- **EmailTemplateTest**: Tests del modelo y procesamiento
- **EmailTemplateTypeTest**: Tests del enum
- **EmailTemplateSystemIntegrationTest**: Tests de integración completa

### Ejecución de Tests
```bash
mvn test
```

### Tipos de Tests
1. **Unitarios**: Verifican lógica individual de componentes
2. **Integración**: Verifican funcionamiento conjunto del sistema
3. **Funcionales**: Verifican procesamiento completo de plantillas

## 🚀 Agregar Nuevas Plantillas

### 1. Agregar Tipo al Enum
```java
public enum EmailTemplateType {
    WELCOME("welcome", "Email de bienvenida"),
    RECOVERY("recovery", "Email de recuperación"),
    NOTIFICATION("notification", "Email de notificaciones"),
    NEW_TYPE("new-type", "Nueva funcionalidad"); // ← Agregar aquí
}
```

### 2. Crear Plantilla en el Seeder
```java
private void seedNewTemplate() {
    if (templateService.templateExists(EmailTemplateType.NEW_TYPE)) {
        return;
    }

    String htmlContent = "<!DOCTYPE html>..." // HTML con placeholders
    EmailTemplate newTemplate = new EmailTemplate(
        "new-template",
        EmailTemplateType.NEW_TYPE,
        "Asunto del nuevo email",
        htmlContent,
        "Descripción de la nueva plantilla"
    );

    templateService.saveTemplate(newTemplate);
}
```

### 3. Llamar al método en run()
```java
@Override
public void run(String... args) throws Exception {
    seedNotificationTemplate();
    seedNewTemplate(); // ← Agregar aquí
```java
public class NewEmailRequest implements EmailRequest {
```

public void sendNewEmail(NewEmailRequest request) throws Exception {
    sendEmail(new NewEmailStrategy(templateService), request);

### application.properties
spring.mail.port=587
spring.mail.password=tu-app-password
```

### Dependencias Maven
```xml
<!-- Spring Boot Starter Mail -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- Spring Boot Starter Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 📊 Monitoreo y Métricas
### Logs
El sistema registra:
- Inicialización de plantillas
- Errores en envío

### Métricas Disponibles
- Número de plantillas activas
- Tasa de éxito de envío

## 🔒 Seguridad

- Todas las plantillas se validan al cargar
- Placeholders se sanitizan automáticamente
- Contenido HTML se escapa apropiadamente

### Buenas Prácticas
- No incluir datos sensibles en plantillas
- Usar HTTPS para URLs de recursos externos
- Validar contenido antes de envío

## 🎯 Beneficios del Sistema

### Para Desarrolladores
- ✅ **Mantenibilidad**: Cambios en diseño se aplican globalmente
- ✅ **Consistencia**: Todos los emails siguen el mismo estilo
- ✅ **Flexibilidad**: Fácil agregar nuevos tipos de email
- ✅ **Testabilidad**: Cada componente se puede probar aisladamente

### Para el Negocio
- ✅ **Profesionalismo**: Emails con diseño consistente y moderno
- ✅ **Personalización**: Contenido adaptado a cada usuario
- ✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades
- ✅ **Confiabilidad**: Sistema probado y con manejo de errores

## 🔄 Migración desde Sistema Anterior

### Cambios Realizados
1. **Estrategias refactorizadas** para usar plantillas
2. **HTML movido** de código hardcodeado a plantillas
3. **Sistema de placeholders** implementado
4. **Seeder automático** agregado

### Compatibilidad
- ✅ APIs existentes siguen funcionando
- ✅ Contratos de servicios mantenidos
- ✅ Funcionalidad de envío preservada

## 📈 Próximas Mejoras

### Funcionalidades Futuras
- [ ] Persistencia en base de datos
- [ ] Editor visual de plantillas
- [ ] Versionado de plantillas
- [ ] A/B testing de diseños
- [ ] Análisis de rendimiento de envío

### Optimizaciones
- [ ] Cache de plantillas procesadas
- [ ] Compresión de HTML
- [ ] Optimización de imágenes

---

**Autor**: Sistema de Documentación Automática
**Versión**: 1.0
**Última actualización**: Octubre 2025</content>
<parameter name="filePath">d:\Documentos\Repositories\Adoptafacil-laravel\mail-service\EMAIL_TEMPLATE_SYSTEM.md