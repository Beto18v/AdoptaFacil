
# Chatbot FAQ Service – Documentación Técnica

Este microservicio, desarrollado con FastAPI (Python 3.8+), provee un chatbot de preguntas frecuentes para la plataforma AdoptaFácil. Permite responder dudas comunes de usuarios y automatizar la atención básica.

## Características principales

- API REST con FastAPI
- Motor de respuestas basado en reglas y/o IA (ajustar según implementación)
- Integración lista para Laravel y React
- CORS configurable
- Logging y manejo de errores
- Docker support

## Estructura del Proyecto

```
chatbot-faq-service/
├── Dockerfile
├── requirements.txt
└── app/
    ├── __init__.py
    ├── main.py
    ├── schemas.py
    └── routers/
        └── chat.py
```

## Instalación y Ejecución

### Requisitos
- Python 3.8+
- Docker (opcional)

### Instalación Manual
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Ejecución con Docker
```bash
docker build -t chatbot-faq-service .
docker run -p 8000:8000 chatbot-faq-service
```

## Endpoints principales

- `POST /chat/faq` – Recibe una pregunta y responde automáticamente
- `GET /health` – Healthcheck


### Ejemplo de request
```json
{
   "question": "¿Cómo adopto una mascota?"
}
```

### Ejemplo de response
```json
{
   "answer": "Para adoptar una mascota, debes registrarte en la plataforma y seguir el proceso de solicitud."
}
```


## Integración

### Laravel
- Consumir el endpoint `/chat/faq` desde el backend para mostrar respuestas automáticas en el frontend.

### React
- Consumir el endpoint `/chat/faq` desde componentes de chat o ayuda.

## Desarrollo y extensión
- Para agregar nuevas preguntas frecuentes, modifica la lógica en `routers/chat.py`.
- Para agregar nuevos endpoints, crea nuevos routers en la carpeta `routers` y regístralos en `main.py`.

---
**Última actualización:** Octubre 2025
