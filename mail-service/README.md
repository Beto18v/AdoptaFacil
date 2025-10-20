# Spring Boot Mail Service

Este es un proyecto Spring Boot creado con Maven, utilizando Java 17+. Incluye las dependencias `spring-boot-starter-mail` y `spring-boot-starter-web`.

## Integración con Laravel

Este microservicio está integrado con el backend de Laravel para enviar emails de bienvenida automáticamente cuando un usuario se registra.

- **Trigger**: Después del registro exitoso en Laravel (`RegisteredUserController`)
- **Petición**: HTTP POST a `/api/send-welcome-email` con `email` y `name`
- **Manejo de errores**: No interrumpe el flujo de registro si falla

## Requisitos

- Java 17 o superior
- Maven 3.6+

## Cómo ejecutar

1. Clona o navega al directorio del proyecto.
2. Ejecuta `mvn spring-boot:run` para iniciar la aplicación.

## Estructura del proyecto

- `src/main/java/com/example/demo/DemoApplication.java`: Clase principal de Spring Boot.
- `src/main/java/com/example/demo/EmailService.java`: Servicio para envío de emails.
- `src/main/java/com/example/demo/WelcomeEmailController.java`: Controlador REST para envío de emails de bienvenida.
- `src/main/java/com/example/demo/WelcomeEmailRequest.java`: DTO para solicitudes de email de bienvenida.
- `src/main/resources/application.properties`: Archivo de configuración.
- `src/test/java/com/example/demo/DemoApplicationTests.java`: Clase de pruebas.
- `src/test/java/com/example/demo/EmailServiceTest.java`: Tests unitarios para EmailService.
- `src/test/java/com/example/demo/WelcomeEmailControllerTest.java`: Tests unitarios para WelcomeEmailController.

## Endpoints disponibles

### GET /api/health

Verifica que el microservicio esté funcionando.

**Response:**

- 200 OK: "Microservicio funcionando correctamente"

### POST /api/send-welcome-email

Envía un email de bienvenida personalizado.

**Request Body:**

```json
{
  "email": "usuario@email.com",
  "name": "Juan Pérez"
}
```

**Response:**

- 200 OK: "Email de bienvenida enviado exitosamente a usuario@email.com"
- 400 Bad Request: Error en la solicitud
- 500 Internal Server Error: Error al enviar el email

## Servicios disponibles

### EmailService

- `sendWelcomeEmail(WelcomeEmailRequest request)`: Envía un email de bienvenida personalizado al destinatario especificado.

## Tests unitarios

Se han implementado tests unitarios usando JUnit 5 y Mockito:

### EmailServiceTest

- ✅ `sendWelcomeEmail_ShouldSendCorrectMessage`: Verifica que el email se envíe con el contenido correcto.
- ✅ `sendWelcomeEmail_ShouldHandleNullRequest`: Verifica el manejo de valores nulos.

### WelcomeEmailControllerTest

Los tests del controlador están implementados pero requieren Mockito compatible con Java 24. Actualmente fallan debido a limitaciones de Byte Buddy (versión 1.14.10 soporta hasta Java 22).

**Nota sobre compatibilidad:** Si encuentras errores con Mockito en Java 24, considera:

- Actualizar Byte Buddy a una versión compatible
- Usar Java 17 o 21 para desarrollo/testing
- Configurar `-Dnet.bytebuddy.experimental=true` como propiedad JVM

## Configuración SMTP

## Configuración SMTP

Configura las siguientes variables de entorno antes de ejecutar:

- `MAIL_HOST`: Servidor SMTP (ej: smtp.gmail.com)
- `MAIL_PORT`: Puerto SMTP (ej: 587)
- `MAIL_USERNAME`: Usuario del correo
- `MAIL_PASSWORD`: Contraseña o contraseña de aplicación

## Dependencias

- Spring Boot Starter Web
- Spring Boot Starter Mail
- Spring Boot Starter Test (para pruebas)
