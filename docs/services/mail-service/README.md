
# Servicio de Correo – Documentación Técnica

Este microservicio, desarrollado en Spring Boot (Java 17+), permite el envío de correos electrónicos transaccionales y masivos, integrándose fácilmente con otros sistemas como Laravel.

---

## Índice

1. [Características principales](#características-principales)
2. [Patrón Strategy (Arquitectura)](#patrón-strategy-arquitectura)
3. [Sistema de Plantillas de Email](#sistema-de-plantillas-de-email)
4. [Integración con Laravel](#integración-con-laravel)
5. [Recuperación de Contraseña](#recuperación-de-contraseña)
6. [Seeders](#seeders)
7. [Pruebas y Métricas](#pruebas-y-métricas)
8. [Ejemplo de Endpoints](#ejemplo-de-endpoints)
9. [Requisitos y Ejecución](#requisitos-y-ejecución)
10. [Buenas Prácticas y Seguridad](#buenas-prácticas-y-seguridad)
11. [Informe de Funcionalidades](#informe-de-funcionalidades)

---

## Características principales

- Patrón Strategy para manejo modular de tipos de email
- Sistema de plantillas HTML reutilizables y personalizables
- Endpoints REST robustos y validados
- Integración con Laravel para emails de bienvenida y recuperación
- Envío masivo y personalizado
- Ejecución asíncrona
- Pruebas unitarias e integración incluidas

---

## Patrón Strategy (Arquitectura)

El servicio implementa el **Patrón Strategy** para el envío de emails, permitiendo encapsular y extender fácilmente la lógica de cada tipo de correo (bienvenida, recuperación, notificación, etc.).

**Ventajas:**
- Extensibilidad y mantenibilidad
- Testabilidad por tipo de email
- Separación de responsabilidades

**Estructura:**
- Interfaz `EmailStrategy` y DTOs (`EmailRequest`, `WelcomeEmailRequest`, etc.)
- Estrategias concretas: `WelcomeEmailStrategy`, `RecoveryEmailStrategy`, `NotificationEmailStrategy`
- Servicio central: `EmailService` (inyecta y ejecuta la estrategia)

**Ejemplo de uso:**
```java
public void sendWelcomeEmail(WelcomeEmailRequest request) throws Exception {
		sendEmail(new WelcomeEmailStrategy(), request);
}
```

**Endpoints principales:**
- `POST /api/send-welcome-email`
- `POST /api/send-recovery-email`
- `POST /api/send-notification-email`

---

## Sistema de Plantillas de Email

El sistema de plantillas permite definir emails HTML reutilizables con placeholders dinámicos (`{{name}}`, `{{token}}`, etc.).

**Componentes:**
- Modelo `EmailTemplate` (id, type, subject, htmlContent, ...)
- Enum `EmailTemplateType` (WELCOME, RECOVERY, NOTIFICATION)
- Servicio `EmailTemplateService` (gestión y procesamiento de plantillas)
- Seeder `EmailTemplateSeeder` (inicialización automática)

**Flujo:**
1. Seeder crea plantillas al iniciar la app
2. Estrategia consulta y procesa la plantilla
3. Placeholders se reemplazan con datos dinámicos
4. Email se envía personalizado

**Ejemplo de uso en estrategia:**
```java
String subject = templateService.getSubject(EmailTemplateType.WELCOME);
String htmlContent = templateService.processTemplate(EmailTemplateType.WELCOME, placeholders);
helper.setSubject(subject);
helper.setText(htmlContent, true);
```

**Placeholders disponibles:**
- Bienvenida: `{{name}}`
- Recuperación: `{{name}}`, `{{token}}`
- Notificación: `{{name}}`, `{{message}}`

**Características de las plantillas:**
- Diseño responsivo y accesible
- Elementos visuales y branding
- Seguridad: placeholders sanitizados y HTML escapado

---

## Integración con Laravel

- Trigger: Registro exitoso en Laravel
- Endpoint: `POST /api/send-welcome-email` (parámetros: `email`, `name`)
- Manejo de errores: No interrumpe el flujo de registro

---

## Recuperación de Contraseña

El sistema permite a los usuarios recuperar su contraseña mediante un flujo seguro:

1. Usuario solicita recuperación (`POST /api/forgot-password`)
2. Spring Boot valida y envía PIN por email
3. Usuario resetea contraseña (`POST /api/reset-password`)
4. Spring Boot valida PIN y actualiza contraseña en Laravel

**Ejemplo de requests:**
```json
// Solicitud de recuperación
{
	"email": "user@example.com"
}
// Reset de contraseña
{
	"email": "user@example.com",
	"token": "123456",
	"newPassword": "newpassword123",
	"confirmPassword": "newpassword123"
}
```

**Configuración relevante:**
```properties
# Laravel API
laravel.api.base-url=http://localhost:8000/api
laravel.api.users-endpoint=/users
laravel.api.reset-password-endpoint=/reset-password
# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

## Seeders

Los seeders permiten poblar la base de datos con datos de ejemplo para usuarios, refugios, productos, publicaciones y dashboard.

**Principales seeders:**
- UserSeeder: usuarios base (admin, aliado, cliente)
- ShelterSeeder: refugios y mascotas
- ProductSeeder: productos de la tienda
- PostSeeder: publicaciones de comunidad
- DashboardDataSeeder: métricas y estadísticas

**Ejecución:**
```bash
php artisan db:seed
# O uno específico
php artisan db:seed --class=UserSeeder
```

**Notas:**
- Usa `firstOrCreate()` para evitar duplicados
- Contraseñas encriptadas y emails únicos
- Datos realistas y apropiados para pruebas

---

## Pruebas y Métricas

**Cobertura de tests:**
- EmailTemplateServiceTest, EmailTemplateSeederTest, EmailTemplateTest, EmailTemplateTypeTest, EmailTemplateSystemIntegrationTest
- PasswordResetServiceTest, UserApiServiceTest, RecoveryEmailControllerTest, WelcomeEmailControllerTest, EmailServiceTest, EmailTemplateServiceTest, WelcomeEmailStrategyTest

**Ejecución:**
```bash
mvn test
```

**Resultados:**
- Todas las pruebas deben pasar (ver `target/surefire-reports/` y `target/reports/surefire.html`)

---

## Ejemplo de Endpoints

- `GET /api/health` – Healthcheck
- `POST /api/send-welcome-email` – Email de bienvenida
- `POST /api/send-bulk-email` – Envío masivo
- `POST /api/forgot-password` – Solicitud de recuperación
- `POST /api/reset-password` – Reset de contraseña

---

## Requisitos y Ejecución

- Java 17+
- Maven 3.6+

**Ejecución local:**
```bash
mvn spring-boot:run
```

---

## Buenas Prácticas y Seguridad

- Separación de contenido y lógica (plantillas, estrategias)
- Placeholders y HTML sanitizados
- Tokens seguros y de un solo uso para recuperación
- Validación de DTOs y entradas
- Contraseñas encriptadas y datos sensibles protegidos
- Documentación clara y actualizada

---

## Informe de Funcionalidades

### Email Template
- Plantillas reutilizables, personalizables y seguras
- Variables dinámicas para personalización

### Password Reset
- Flujo seguro y validado de recuperación
- Tokens únicos y expiración

### Seeders
- Datos de ejemplo para desarrollo y pruebas
- Idempotencia y separación de datos

### Strategy Pattern
- Extensibilidad y bajo acoplamiento
- Fácil de probar y mantener

### Pruebas Automáticas
- 77 pruebas ejecutadas, 0 fallos, 0 errores, 0 omitidas (ver surefire-reports)

---

**Última actualización:** Noviembre 2025