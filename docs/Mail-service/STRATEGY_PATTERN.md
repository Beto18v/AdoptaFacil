# Patrón Strategy - Servicio de Emails AdoptaFacil

## 📋 Descripción General

Este documento describe la implementación del **Patrón Strategy** en el servicio de emails de AdoptaFacil. El patrón Strategy permite encapsular algoritmos intercambiables y seleccionar uno dinámicamente en tiempo de ejecución.

## 🎯 ¿Qué es el Patrón Strategy?

El patrón Strategy es un patrón de diseño comportamental que define una familia de algoritmos, los encapsula y los hace intercambiables. Permite que el algoritmo varíe independientemente de los clientes que lo utilizan.

### Beneficios en este contexto:
- **Extensibilidad**: Fácil agregar nuevos tipos de emails
- **Mantenibilidad**: Cada tipo de email está aislado
- **Testabilidad**: Cada estrategia puede probarse independientemente
- **Separación de responsabilidades**: Lógica de negocio separada de la infraestructura

## 🏗️ Estructura Implementada

### 1. Interfaz Strategy (`EmailStrategy`)
```java
public interface EmailStrategy {
    void sendEmail(EmailRequest request, MimeMessage message) throws Exception;
}
```
- Define el contrato común para todas las estrategias
- Recibe un `EmailRequest` genérico y un `MimeMessage` pre-configurado

### 2. Estrategias Concretas

#### `WelcomeEmailStrategy`
- **Propósito**: Enviar emails de bienvenida a nuevos usuarios
- **Contenido**: Mensaje personalizado con nombre del usuario, logo y llamada a acción
- **Endpoint**: `POST /api/send-welcome-email`

#### `RecoveryEmailStrategy`
- **Propósito**: Enviar emails de recuperación de contraseña
- **Contenido**: Enlace seguro con token para resetear contraseña
- **Endpoint**: `POST /api/send-recovery-email`

#### `NotificationEmailStrategy`
- **Propósito**: Enviar notificaciones generales
- **Contenido**: Mensaje personalizado configurable
- **Endpoint**: `POST /api/send-notification-email`

### 3. Contexto (`EmailService`)
```java
@Service
public class EmailService {

    @Async
    public void sendEmail(EmailStrategy strategy, EmailRequest request) throws Exception {
        // Configuración común del mensaje
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(mailUsername);

        // Delegación a la estrategia específica
        strategy.sendEmail(request, message);

        // Envío del mensaje
        mailSender.send(message);
    }

    // Métodos específicos que usan las estrategias
    public void sendWelcomeEmail(WelcomeEmailRequest request) throws Exception {
        sendEmail(new WelcomeEmailStrategy(), request);
    }
}
```

### 4. DTOs (Data Transfer Objects)

#### Interfaz Común
```java
public interface EmailRequest {
    String getEmail();
}
```

#### DTOs Específicos
- `WelcomeEmailRequest`: email, name
- `RecoveryEmailRequest`: email, name, token
- `NotificationEmailRequest`: email, name, message

## 🔄 Flujo de Ejecución

```
1. Cliente hace POST a /api/send-welcome-email
   ↓
2. WelcomeEmailController recibe la petición
   ↓
3. Controller llama emailService.sendWelcomeEmail(request)
   ↓
4. EmailService.sendEmail(new WelcomeEmailStrategy(), request)
   ↓
5. WelcomeEmailStrategy configura el contenido del email
   ↓
6. EmailService envía el mensaje
```

## 📝 Ejemplos de Uso

### Email de Bienvenida
```bash
POST /api/send-welcome-email
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez"
}
```

### Email de Recuperación
```bash
POST /api/send-recovery-email
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "token": "abc123def456"
}
```

### Email de Notificación
```bash
POST /api/send-notification-email
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "message": "Tu mascota ha sido adoptada exitosamente."
}
```

## 🧪 Testing

### Estrategias
Cada estrategia tiene pruebas unitarias que verifican:
- Configuración correcta del destinatario
- Asunto apropiado
- Contenido HTML válido

### Servicio
El `EmailService` se prueba con mocks para verificar:
- Llamadas correctas a las estrategias
- Configuración del remitente
- Envío del mensaje

## 🚀 Agregar Nueva Estrategia

Para agregar un nuevo tipo de email:

1. **Crear DTO** que implemente `EmailRequest`
```java
public class NewEmailRequest implements EmailRequest {
    // campos específicos
}
```

2. **Crear Estrategia** que implemente `EmailStrategy`
```java
public class NewEmailStrategy implements EmailStrategy {
    @Override
    public void sendEmail(EmailRequest request, MimeMessage message) throws Exception {
        // lógica específica
    }
}
```

3. **Agregar método en EmailService**
```java
public void sendNewEmail(NewEmailRequest request) throws Exception {
    sendEmail(new NewEmailStrategy(), request);
}
```

4. **Crear Controller** (opcional)
```java
@PostMapping("/send-new-email")
public ResponseEntity<String> sendNewEmail(@Valid @RequestBody NewEmailRequest request) {
    // implementación
}
```

## 📊 Comparación con Enfoque Monolítico

### Antes (Monolítico)
```java
public void sendEmail(String type, EmailRequest request) {
    if (type.equals("welcome")) {
        // lógica welcome inline
    } else if (type.equals("recovery")) {
        // lógica recovery inline
    } else if (type.equals("notification")) {
        // lógica notification inline
    }
}
```

### Después (Strategy)
```java
public void sendEmail(EmailStrategy strategy, EmailRequest request) {
    strategy.sendEmail(request, message);
}
```

### Ventajas del Strategy:
- ✅ Código más limpio y modular
- ✅ Fácil agregar nuevos tipos
- ✅ Cada estrategia es independiente
- ✅ Mejor testabilidad
- ✅ Menos condicionales complejos

## 🔧 Configuración

### application.properties
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Dependencias Maven
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 📈 Métricas y Monitoreo

- **Logs**: Cada envío se registra con nivel INFO/ERROR
- **Métricas**: Se puede agregar monitoreo de éxito/fallo por estrategia
- **Alertas**: Configurar alertas si el ratio de fallos supera un umbral

## 🎨 Diseño de Emails

Todos los emails siguen un diseño consistente:
- **Header**: Logo de AdoptaFacil con gradiente
- **Contenido**: Mensaje personalizado centrado
- **Footer**: Información de contacto
- **Responsive**: Diseño adaptable a móviles
- **Accesibilidad**: Contraste adecuado y texto alternativo

## 🔒 Seguridad

- **Validación**: Todos los DTOs usan validaciones Jakarta
- **Sanitización**: Contenido HTML escapado apropiadamente
- **Rate Limiting**: Considerar implementar límites de envío
- **Autenticación**: Endpoints protegidos según necesidades

---

**Autor**: Sistema de Documentación Automática
**Fecha**: Octubre 2025
**Versión**: 1.0</content>
<parameter name="filePath">d:\Documentos\Repositories\Adoptafacil-laravel\mail-service\STRATEGY_PATTERN_DOCUMENTATION.md