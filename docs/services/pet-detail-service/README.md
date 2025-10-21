
# Pet Detail Service – Documentación Técnica

Este microservicio, desarrollado con FastAPI (Python 3.8+), genera descripciones emocionales para mascotas en adopción usando la API de Groq AI. Está preparado para integrarse fácilmente con Laravel y React.

## Características principales

- API REST robusta y validada (FastAPI)
- Integración con Groq AI para descripciones emotivas
- CORS configurable para integración multiplataforma
- Logging detallado y manejo de errores
- Validación de datos con Pydantic
- Scripts de inicio para Windows y Linux/Mac
- Integración lista para Laravel y React
- Soporte Docker y Docker Compose

## Estructura del Proyecto

```
pet-detail-service/
├── main.py                  # Aplicación principal FastAPI
├── config.py                # Configuración avanzada
├── requirements.txt         # Dependencias de Python
├── Dockerfile               # Containerización
├── docker-compose.yml       # Orquestación
├── .env.example             # Variables de entorno
├── test_service.py          # Pruebas automatizadas
├── start.sh / start.bat     # Scripts de inicio
├── laravel-integration/     # Integración Laravel
└── react-integration/       # Integración React
```

## �📋 Requisitos

- Python 3.8+
- API Key de Groq ([obtener aquí](https://console.groq.com/keys/))

## ⚡ INICIO RÁPIDO

### 1. Configurar el Microservicio

```bash
# Windows
cd faq-service
start.bat

# Linux/Mac
cd faq-service
bash start.sh
```

### 2. Configurar API Key

- Editar `.env` y agregar la `GROQ_API_KEY`
- Obtener key en: https://console.groq.com/keys

### 3. Verificar Funcionamiento

- Servicio: http://localhost:8001
- Health check: http://localhost:8001/health
- Docs: http://localhost:8001/docs

## ⚙️ Instalación Manual

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
# Editar .env y agregar la GROQ_API_KEY
```


## Ejecución y desarrollo

### Desarrollo

```bash
python main.py
```

### Producción

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

El servicio estará disponible en: `http://localhost:8001`


## Endpoints principales

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


## Integración con Laravel

### Controlador

```php
// app/Http/Controllers/Api/DescripcionMascotaController.php
// Copiar desde: laravel-integration/DescripcionMascotaController.php
```

### Rutas API

```php
// routes/api.php
Route::prefix('descripciones')->group(function () {
    Route::post('/generar', [DescripcionMascotaController::class, 'generarDescripcion']);
    Route::get('/verificar-servicio', [DescripcionMascotaController::class, 'verificarServicio']);
});
```

### Variables de Entorno Laravel

```env
# .env
FAQ_SERVICE_URL=http://localhost:8001
```

### Dependencia Laravel

```bash
composer require guzzlehttp/guzzle
```

### Ejemplo de uso básico

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


## Integración con React

### Hook Personalizado

```typescript
// Copiar: react-integration/useDescripcionIA.ts
// A: resources/js/hooks/useDescripcionIA.ts
```

### En registrar-mascota.tsx

```tsx
// 1. Importar el hook
import { useDescripcionIA } from "../hooks/useDescripcionIA";

// 2. Usar el hook
const { generarDescripcionAutomatica, generandoDescripcion, error } =
  useDescripcionIA();

// 3. Agregar botón después del textarea de descripción
{
  servicioIADisponible && (
    <button onClick={handleGenerarDescripcionIA}>
      Generar descripción con IA
    </button>
  );
}
```


## Docker y despliegue

### Desarrollo

Si prefieres usar Docker:

```bash
# Construir imagen
docker build -t faq-service .

# Ejecutar contenedor
docker run -p 8001:8001 --env-file .env faq-service
```

### Con Docker Compose

```bash
# Construir y ejecutar
docker-compose up --build

# Solo ejecutar
docker-compose up
```

### Producción

```bash
# Producción
docker-compose -f docker-compose.prod.yml up -d
```


## Pruebas

### Pruebas Automatizadas

```bash
# Ejecutar pruebas automatizadas
python test_service.py
```

### Prueba Manual

```bash
# Prueba manual
curl -X POST http://localhost:8001/generar-descripcion \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Max","especie":"Perro","raza":"Labrador","personalidad":"Juguetón","salud":"Perfecto","observaciones":"Ama a los niños"}'
```


## Logs y monitoreo

Los logs se muestran en la consola durante la ejecución. Incluyen:

- Requests recibidos
- Prompts generados
- Respuestas de la API de Groq
- Errores y excepciones

### Logs Útiles

```bash
# Ver logs del servicio
docker-compose logs -f faq-service

# Logs en tiempo real
tail -f logs/app.log
```

### Debugging

1. Verificar que el servicio esté corriendo: GET /health
2. Verificar API key en .env
3. Revisar logs de errores
4. Probar con test_service.py


## Configuración avanzada

### Variables de Entorno Disponibles

| Variable          | Descripción                   | Requerida | Default |
| ----------------- | ----------------------------- | --------- | ------- |
| `GROQ_API_KEY`    | API Key de Groq               | ✅        | -       |
| `PORT`            | Puerto del servicio           | ❌        | 8001    |
| `HOST`            | Host del servicio             | ❌        | 0.0.0.0 |
| `LOG_LEVEL`       | Nivel de logging              | ❌        | INFO    |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS | ❌        | \*      |

### Ejemplo .env

```env
GROQ_API_KEY=your_api_key_here
PORT=8001
HOST=0.0.0.0
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```


## Desarrollo y extensión

Para agregar nuevas funcionalidades:

1. **Modificar el prompt** en `construir_prompt()`
2. **Ajustar parámetros de IA** en `generar_descripcion_con_ai()`
3. **Agregar validaciones** en los modelos Pydantic
4. **Extender endpoints** según necesidades


## Consideraciones de producción

### Seguridad

1. **Configurar CORS** específicamente para tu dominio
2. **Usar HTTPS** en producción
3. **Implementar rate limiting**
4. **Monitorear logs** y métricas
5. **Configurar variables de entorno** de forma segura

### Performance y Escalabilidad

- ✅ CORS configurado
- ✅ Validación de datos con Pydantic
- ✅ Manejo seguro de API keys
- ✅ Rate limiting recomendado para producción
- ✅ Logs detallados en consola
- ✅ Health check endpoint
- ✅ Manejo de errores robusto
- ✅ Timeouts configurables
- ✅ Métricas de rendimiento

### Deploy Recomendaciones

1. **HTTPS**: Usar certificados SSL
2. **Rate Limiting**: Implementar límites de requests
3. **Monitoring**: Configurar logging externo
4. **Scaling**: Usar múltiples instancias
5. **Security**: Restringir CORS a dominios específicos


## Resultados esperados

✅ **Microservicio funcionando** en puerto 8001  
✅ **Laravel integrado** con endpoints de API  
✅ **React conectado** con botón de IA  
✅ **Descripciones emotivas** generadas automáticamente  
✅ **Formulario mejorado** con funcionalidad de IA


## Soporte y troubleshooting

### Estados del Servicio

- **Healthy**: Servicio funcionando correctamente
- **API Key Missing**: Falta configurar GROQ_API_KEY
- **Connection Error**: Problema de conectividad con Groq API

### Errores Comunes

1. **Puerto ocupado**: Cambiar PORT en .env
2. **API Key inválida**: Verificar key en Groq console
3. **CORS error**: Configurar ALLOWED_ORIGINS
4. **Timeout**: Ajustar timeouts en config.py


## Próximos pasos

1. Ejecutar `start.bat` en faq-service
2. Configurar GROQ_API_KEY
3. Copiar archivos de Laravel integration
4. Integrar hook de React en registrar-mascota.tsx
5. Probar funcionalidad completa


---
**¡El microservicio está listo para generar descripciones emocionales de mascotas! 🐶🐱✨**

**Última actualización:** Octubre 2025
