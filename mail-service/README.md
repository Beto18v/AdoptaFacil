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

Este es un microservicio Spring Boot creado con Maven (Java 17+), que permite el envío de correos electrónicos tanto individuales (bienvenida) como masivos, integrándose fácilmente con otros sistemas como Laravel. Incluye las dependencias `spring-boot-starter-mail` y `spring-boot-starter-web`.

## Cómo ejecutar

1. Clona o navega al directorio del proyecto.
2. Ejecuta `mvn spring-boot:run` para iniciar la aplicación.

## ¿Qué realiza este microservicio?

- Envía **correos de bienvenida** personalizados a nuevos usuarios (integración típica con Laravel tras el registro).
- Permite el **envío masivo de correos** personalizados a una lista de destinatarios, útil para notificaciones, campañas o avisos generales.
- Expone endpoints REST para ambos casos, con validación y manejo de errores robusto.
- Incluye pruebas unitarias para los servicios y controladores.
- Soporta ejecución asíncrona para no bloquear el flujo de la aplicación.
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

### POST `/api/send-bulk-email`

Envía un correo masivo personalizado a una lista de destinatarios.

**Request Body:**

```json
{
  "emails": ["correo1@dominio.com", "correo2@dominio.com"],
  "subject": "Asunto del correo",
  "description": "Mensaje o contenido del correo"
}
```

```
**Response:**

- 200 OK: "Correos masivos enviados exitosamente a N destinatarios"
- 400 Bad Request: Error en la solicitud
- 500 Internal Server Error: Error al enviar los correos

```

**Response:**

- 200 OK: "Email de bienvenida enviado exitosamente a usuario@email.com"

## Servicios y clases principales

- **EmailService**
  - `sendWelcomeEmail(WelcomeEmailRequest request)`: Envía un email de bienvenida personalizado (HTML, con logo y botón de acción).
  - `sendBulkEmail(BulkEmailRequest request)`: Envía un correo masivo a una lista de destinatarios, con asunto y mensaje personalizados.
- **WelcomeEmailController**: Expone el endpoint `/api/send-welcome-email`.
- **BulkEmailController**: Expone el endpoint `/api/send-bulk-email`.
- **WelcomeEmailRequest**: DTO para solicitudes de bienvenida (`email`, `name`).
- **BulkEmailRequest**: DTO para solicitudes masivas (`emails` [array], `subject`, `description`).
- 500 Internal Server Error: Error al enviar el email

## Servicios disponibles

### EmailService

- `sendWelcomeEmail(WelcomeEmailRequest request)`: Envía un email de bienvenida personalizado al destinatario especificado.
- `sendBulkEmail_ShouldSendToMultipleRecipients`: Verifica que el envío masivo funciona para todos los destinatarios.

Se han implementado tests unitarios usando JUnit 5 y Mockito:

### EmailServiceTest

- ✅ `sendWelcomeEmail_ShouldSendCorrectMessage`: Verifica que el email se envíe con el contenido correcto.
- ✅ `sendWelcomeEmail_ShouldHandleNullRequest`: Verifica el manejo de valores nulos.

### WelcomeEmailControllerTest

Los tests del controlador están implementados pero requieren Mockito compatible con Java 24. Actualmente fallan debido a limitaciones de Byte Buddy (versión 1.14.10 soporta hasta Java 22).

- Usar Java 17 o 21 para desarrollo/testing
- Configurar `-Dnet.bytebuddy.experimental=true` como propiedad JVM

Configura las siguientes variables de entorno antes de ejecutar:

- `MAIL_PASSWORD`: Contraseña o contraseña de aplicación

## Dependencias

- Spring Boot Starter Web
- Spring Boot Starter Mail
- Spring Boot Starter Test (para pruebas)

## Pruebas unitarias y cómo funcionan

Este proyecto incluye pruebas unitarias implementadas con **JUnit 5** y **Mockito**.

### ¿Qué herramientas se usan y por qué?

- **Mockito**: Permite simular dependencias externas (como el envío de emails) para probar los componentes de forma aislada, sin efectos secundarios.

### ¿Cómo funcionan los tests?

- Los tests de `EmailService` verifican que el servicio construya y envíe correctamente los emails de bienvenida, y que maneje adecuadamente los casos de error (por ejemplo, cuando el request es nulo).
- Los tests de `WelcomeEmailController` simulan peticiones HTTP al endpoint `/api/send-welcome-email` y verifican que la respuesta sea la esperada, tanto en casos exitosos como de error.
- Se usan mocks para evitar enviar correos reales durante las pruebas.

### ¿Cómo ejecutar los tests?

Desde la raíz del proyecto, ejecuta:

```bash
mvn test
```

Esto ejecutará todos los tests y mostrará los resultados en la consola.

### Notas sobre compatibilidad

- Los tests del controlador requieren una versión de Mockito compatible con Java 24. Si usas Java 17 o 21, no tendrás problemas.
- Si usas Java 24 y tienes errores con Mockito, revisa la sección de compatibilidad en este README.
