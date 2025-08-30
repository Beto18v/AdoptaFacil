# Chatbot FAQ Service

Este microservicio proporciona una API para responder preguntas frecuentes relacionadas con la plataforma AdoptaFácil. Está construido con FastAPI y diseñado para integrarse fácilmente con otros módulos del sistema.

## Estructura de Carpetas

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

## Descripción General

- **Dockerfile**: Archivo para construir la imagen Docker del microservicio.
- **requirements.txt**: Lista de dependencias Python necesarias.
- **app/**: Carpeta principal del código fuente.
    - **__init__.py**: Inicializa el paquete `app`.
    - **main.py**: Punto de entrada de la aplicación FastAPI.
    - **schemas.py**: Define los modelos de datos (pydantic) usados en la API.
    - **routers/**: Contiene los routers de la API.
        - **chat.py**: Define las rutas relacionadas con el chatbot FAQ.

## Instalación y Ejecución

### Requisitos
- Python 3.10+
- Docker (opcional)

### Instalación Manual
1. Clona el repositorio y navega a la carpeta `chatbot-faq-service`.
2. Instala las dependencias:
   ```powershell
   pip install -r requirements.txt
   ```
3. Ejecuta el microservicio:
   ```powershell
   uvicorn app.main:app --reload
   ```

### Ejecución con Docker
1. Construye la imagen:
   ```powershell
   docker build -t chatbot-faq-service .
   ```
2. Ejecuta el contenedor:
   ```powershell
   docker run -p 8000:8000 chatbot-faq-service
   ```

## Endpoints Principales

- `POST /chat/faq` - Recibe una pregunta y responde con la información relevante de las FAQ.

### Ejemplo de Request
```json
{
  "question": "¿Cómo adopto una mascota?"
}
```

### Ejemplo de Response
```json
{
  "answer": "Para adoptar una mascota, debes registrarte en la plataforma y seguir el proceso de solicitud."
}
```

## Modelos de Datos

- **FAQRequest**: Modelo para la pregunta recibida.
- **FAQResponse**: Modelo para la respuesta enviada.

## Integración

Este microservicio puede ser consumido por otros módulos de AdoptaFácil, como el frontend React o el backend Laravel, mediante peticiones HTTP.

## Desarrollo y Extensión

- Para agregar nuevas preguntas frecuentes, modifica la lógica en `routers/chat.py`.
- Para agregar nuevos endpoints, crea nuevos routers en la carpeta `routers` y regístralos en `main.py`.

## Autoría y Licencia

Desarrollado por el equipo AdoptaFácil. Uso interno y educativo.
