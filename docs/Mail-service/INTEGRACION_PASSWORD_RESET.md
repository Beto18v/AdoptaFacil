# Integración React + Spring Boot - Recuperación de Contraseña

## Descripción

Sistema completo de recuperación de contraseña que integra componentes React con microservicio Spring Boot.

## Arquitectura

### Frontend (React/TypeScript)

- **forgot-password.tsx**: Formulario para solicitar código de recuperación
- **reset-password.tsx**: Formulario para ingresar PIN y nueva contraseña

### Backend (Spring Boot)

- **RecoveryEmailController**: Endpoints REST para forgot/reset password
- **UserApiService**: Comunicación con API de Laravel para validación
- **PasswordResetService**: Generación y validación de PINs
- **EmailService**: Envío de emails con plantillas

## Flujo de Funcionamiento

1. **Usuario solicita recuperación**:

   - Ingresa email en `forgot-password.tsx`
   - Llama a `POST http://localhost:8080/api/forgot-password`
   - Spring Boot valida email contra Laravel API
   - Genera PIN de 6 dígitos y envía email

2. **Usuario recibe email**:

   - Email contiene PIN y enlace a `/reset-password`
   - Usuario hace clic en enlace o accede directamente

3. **Usuario resetea contraseña**:
   - Ingresa email, PIN, nueva contraseña y confirmación
   - Llama a `POST http://localhost:8080/api/reset-password`
   - Spring Boot valida PIN y actualiza contraseña en Laravel

## Endpoints Spring Boot

### POST /api/forgot-password

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (éxito):**

```json
"Se ha enviado un código de recuperación a tu email."
```

**Response (error):**

```json
"El email no está registrado en el sistema."
```

### POST /api/reset-password

**Request:**

```json
{
  "email": "user@example.com",
  "token": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (éxito):**

```json
"Contraseña actualizada exitosamente."
```

## Configuración

### Spring Boot (application.properties)

```properties
# Laravel API Configuration
laravel.api.base-url=http://localhost:8000/api
laravel.api.users-endpoint=/users
laravel.api.reset-password-endpoint=/reset-password

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### React

Los componentes llaman directamente a `http://localhost:8080/api/...`
Asegúrate de que CORS esté configurado en Spring Boot.

## Pruebas

### Ejecutar tests de Spring Boot

```bash
cd mail-service
mvn test
```

### Tests incluidos

- **PasswordResetServiceTest**: Generación y validación de tokens
- **UserApiServiceTest**: Comunicación con API Laravel
- **RecoveryEmailControllerTest**: Endpoints REST

## Seguridad

- PINs de 6 dígitos con expiración de 15 minutos
- Validación de contraseñas (mínimo 8 caracteres)
- Comunicación HTTPS recomendada en producción
- Validación de email contra base de datos de usuarios

## Próximos pasos

1. Configurar HTTPS en producción
2. Implementar rate limiting para prevenir abuso
3. Agregar logging detallado para auditoría
4. Considerar usar JWT en lugar de PINs para mayor seguridad</content>
   <parameter name="filePath">d:\Documentos\Repositories\Adoptafacil-laravel\INTEGRACION_PASSWORD_RESET.md
