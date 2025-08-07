# Microservicio de Descripciones de Mascotas

Este microservicio FastAPI genera descripciones emocionales para mascotas en adopción utilizando la API de DeepSeek Chat.

## 🚀 Características

- **API REST** con FastAPI
- **Integración con DeepSeek AI** para generar descripciones emotivas
- **CORS configurado** para integración con Laravel
- **Manejo de errores** robusto
- **Logging** detallado
- **Validación de datos** con Pydantic

## 📋 Requisitos

- Python 3.8+
- API Key de DeepSeek ([obtener aquí](https://platform.deepseek.com/))

## ⚙️ Instalación

1. **Crear entorno virtual:**

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows
```

2. **Instalar dependencias:**

```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**

```bash
cp .env.example .env
# Editar .env y agregar tu DEEPSEEK_API_KEY
```

## 🏃‍♂️ Ejecutar el servicio

### Desarrollo

```bash
python main.py
```

### Producción

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

El servicio estará disponible en: `http://localhost:8001`

## 📖 API Endpoints

### GET /

Información básica del servicio

### GET /health

Verificación de salud del servicio

### POST /generar-descripcion

Genera una descripción emocional para una mascota

**Request body:**

```json
{
  "nombre": "Luna",
  "especie": "Perro",
  "raza": "Mestiza",
  "personalidad": "Juguetona, cariñosa",
  "salud": "Vacunas al día",
  "observaciones": "Le encantan los niños"
}
```

**Response:**

```json
{
  "descripcion": "¡Hola! Soy Luna, una perrita mestiza con el corazón lleno de amor y las patas listas para jugar..."
}
```

## 🔧 Integración con Laravel

Para integrar este microservicio con tu aplicación Laravel, puedes usar Guzzle HTTP:

```php
// En tu controlador Laravel
use GuzzleHttp\Client;

$client = new Client();
$response = $client->post('http://localhost:8001/generar-descripcion', [
    'json' => [
        'nombre' => $mascota->nombre,
        'especie' => $mascota->especie,
        'raza' => $mascota->raza,
        'personalidad' => $mascota->personalidad,
        'salud' => $mascota->salud,
        'observaciones' => $mascota->observaciones
    ]
]);

$data = json_decode($response->getBody(), true);
$descripcion = $data['descripcion'];
```

## 🐳 Docker (Opcional)

Si prefieres usar Docker:

```bash
# Construir imagen
docker build -t faq-service .

# Ejecutar contenedor
docker run -p 8001:8001 --env-file .env faq-service
```

## 📝 Logs

Los logs se muestran en la consola durante la ejecución. Incluyen:

- Requests recibidos
- Prompts generados
- Respuestas de la API de DeepSeek
- Errores y excepciones

## 🛠️ Desarrollo

Para agregar nuevas funcionalidades:

1. **Modificar el prompt** en `construir_prompt()`
2. **Ajustar parámetros de IA** en `generar_descripcion_con_ai()`
3. **Agregar validaciones** en los modelos Pydantic
4. **Extender endpoints** según necesidades

## ⚠️ Consideraciones de Producción

1. **Configurar CORS** específicamente para tu dominio
2. **Usar HTTPS** en producción
3. **Implementar rate limiting**
4. **Monitorear logs** y métricas
5. **Configurar variables de entorno** de forma segura

## 🔑 Variables de Entorno

| Variable           | Descripción         | Requerida             |
| ------------------ | ------------------- | --------------------- |
| `DEEPSEEK_API_KEY` | API Key de DeepSeek | ✅                    |
| `PORT`             | Puerto del servicio | ❌ (default: 8001)    |
| `HOST`             | Host del servicio   | ❌ (default: 0.0.0.0) |
| `LOG_LEVEL`        | Nivel de logging    | ❌ (default: INFO)    |
