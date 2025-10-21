# Servicio de Correo – Documentación Técnica

Este microservicio, desarrollado en Spring Boot (Java 17+), permite el envío de correos electrónicos transaccionales y masivos, integrándose fácilmente con otros sistemas como Laravel.

## Características principales

- Patrón Strategy para manejo modular de tipos de email ([ver detalles](STRATEGY_PATTERN.md))
- Endpoints REST robustos y validados
- Integración con Laravel para emails de bienvenida
- Envío masivo y personalizado
- Ejecución asíncrona
- Pruebas unitarias incluidas

## Integración con Laravel

- Trigger: Registro exitoso en Laravel
- Endpoint: `POST /api/send-welcome-email` (parámetros: `email`, `name`)
- Manejo de errores: No interrumpe el flujo de registro

## Ejecución local

```bash
mvn spring-boot:run
```

## Endpoints principales

- `GET /api/health` – Healthcheck
- `POST /api/send-welcome-email` – Email de bienvenida
- `POST /api/send-bulk-email` – Envío masivo

## Estructura relevante

- `EmailService.java` – Servicio principal
- `WelcomeEmailController.java` – Controlador REST
- `WelcomeEmailRequest.java` – DTO
- `application.properties` – Configuración
- Pruebas unitarias en `src/test/`

## Requisitos

- Java 17+
- Maven 3.6+

## Más información

Consulta [STRATEGY_PATTERN.md](STRATEGY_PATTERN.md) para detalles de arquitectura y extensión.

---
**Última actualización:** Octubre 2025