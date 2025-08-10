"""
Microservicio FastAPI para generar descripciones emocionales de mascotas en adopción.

Este servicio utiliza diferentes APIs de IA (Groq, OpenAI, DeepSeek) para generar
descripciones persuasivas y emotivas que ayuden a conectar mascotas con familias adoptantes.

Características principales:
- Soporte para múltiples proveedores de IA
- Generación de descripciones en primera persona
- Ajuste automático de género según la mascota
- Integración con sistemas Laravel y React
- Configuración flexible de APIs

Autor: Equipo AdoptaFácil
Versión: 1.0.0
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import logging

# Cargar variables de entorno
_ = load_dotenv()  # Asignar a _ para indicar que no se usa el valor de retorno

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Generador de Descripciones de Mascotas",
    description="Microservicio para generar descripciones emocionales de mascotas usando IA",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde Laravel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class MascotaRequest(BaseModel):
    nombre: str
    especie: str
    raza: str
    sexo: str  # Macho, Hembra
    personalidad: str
    salud: str
    observaciones: str
    descripcion_actual: str = ""  # Descripción que ya escribió el usuario

class DescripcionResponse(BaseModel):
    descripcion: str

# Configuración de APIs disponibles
API_PROVIDER = os.getenv("API_PROVIDER", "groq")  # groq, openai, deepseek
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# URLs de las APIs
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# Configuración por proveedor de IA
API_CONFIG = {
    "groq": {
        "url": GROQ_API_URL,
        "key": GROQ_API_KEY,
        "model": "llama3-8b-8192",  # Modelo gratuito y rápido de Groq
        "max_tokens": 200  # Límite para descripciones concisas
    },
    "openai": {
        "url": OPENAI_API_URL,
        "key": OPENAI_API_KEY,
        "model": "gpt-3.5-turbo",  # Modelo estándar de OpenAI
        "max_tokens": 200  # Límite para descripciones concisas
    },
    "deepseek": {
        "url": DEEPSEEK_API_URL,
        "key": DEEPSEEK_API_KEY,
        "model": "deepseek-chat",  # Modelo de DeepSeek
        "max_tokens": 200  # Límite para descripciones concisas
    }
}

current_config = API_CONFIG.get(API_PROVIDER)
if not current_config or not current_config["key"]:
    logger.warning(f"API key no configurada para {API_PROVIDER}. Verificando otras opciones...")
    
    # Buscar la primera API disponible
    for provider, config in API_CONFIG.items():
        if config["key"]:
            API_PROVIDER = provider  # pyright: ignore[reportConstantRedefinition]
            current_config = config
            logger.info(f"Usando {provider} como proveedor de IA")
            break
    
    if not current_config or not current_config["key"]:
        logger.error("No se encontró ninguna API key configurada")

def construir_prompt(mascota: MascotaRequest) -> str:
    """
    Construye un prompt optimizado para generar descripciones de mascotas.
    
    Crea un prompt específico que incluye datos de la mascota, instrucciones
    de formato y pautas para generar una descripción emotiva y persuasiva.
    
    Args:
        mascota (MascotaRequest): Datos de la mascota para la descripción
        
    Returns:
        str: Prompt formateado para la IA
    """
    
    # Determinar género y artículos según sexo y especie
    genero_info = determinar_genero(mascota.sexo, mascota.especie)
    
    # Construir la información básica de la mascota
    prompt = f"""
Crea una descripción emocional y persuasiva para una mascota en adopción con las siguientes características:

📝 DATOS DE LA MASCOTA:
- Nombre: {mascota.nombre}
- Especie: {mascota.especie}
- Raza: {mascota.raza}
- Sexo: {mascota.sexo}
- Personalidad: {mascota.personalidad}
- Estado de salud: {mascota.salud}
- Observaciones especiales: {mascota.observaciones}"""
    
    # Si hay una descripción actual, incluirla para mejorarla
    if mascota.descripcion_actual and mascota.descripcion_actual.strip():
        prompt += f"""
- Descripción actual: "{mascota.descripcion_actual}"

🎯 IMPORTANTE: Mejora y expande la descripción actual manteniendo las ideas principales."""
    
    # Agregar instrucciones específicas para la generación
    prompt += f"""

📋 INSTRUCCIONES:
1. Escribe en primera persona como si fuera la mascota
2. {genero_info}
3. MÁXIMO 80-100 palabras (descripción concisa)
4. Incluye 1-2 características principales
5. Tono cálido pero directo
6. Evita repeticiones innecesarias
7. Enfócate en lo especial para adopción
8. Termina con llamado simple a adopción

🎯 OBJETIVO: Generar conexión emocional para motivar la adopción de {mascota.nombre}.
"""
    
    return prompt.strip()

def determinar_genero(sexo: str, especie: str) -> str:
    """Determina cómo debe escribir la mascota según su sexo y especie"""
    sexo_lower = sexo.lower()
    especie_lower = especie.lower()
    
    if sexo_lower in ['macho', 'masculino', 'm']:
        if 'perro' in especie_lower:
            return "Escribe como 'Soy un perro', 'soy cariñoso', etc."
        elif 'gato' in especie_lower:
            return "Escribe como 'Soy un gato', 'soy juguetón', etc."
        else:
            return f"Escribe como 'Soy un {especie_lower}', usando género masculino."
    
    elif sexo_lower in ['hembra', 'femenino', 'f']:
        if 'perro' in especie_lower or 'perra' in especie_lower:
            return "Escribe como 'Soy una perra', 'soy cariñosa', etc."
        elif 'gato' in especie_lower or 'gata' in especie_lower:
            return "Escribe como 'Soy una gata', 'soy juguetona', etc."
        else:
            return f"Escribe como 'Soy una {especie_lower}', usando género femenino."
    
    else:
        return "Usa el género neutro o el que mejor se adapte al nombre."


def limpiar_comillas(texto: str) -> str:
    """
    Limpia diferentes tipos de comillas del texto de forma inteligente.
    
    Elimina comillas que envuelven toda la descripción o que aparecen
    innecesariamente, pero mantiene comillas que son parte del contenido.
    
    Args:
        texto (str): Texto a limpiar
        
    Returns:
        str: Texto sin comillas innecesarias
    """
    if not texto:
        return texto
    
    # Limpiar espacios al inicio y final
    texto = texto.strip()
    
    # Lista de patrones de comillas a eliminar
    comillas_a_eliminar = ['"', "'", '"', '"', ''', ''', '«', '»']
    
    # Eliminar comillas que envuelven todo el texto
    for comilla in comillas_a_eliminar:
        if texto.startswith(comilla) and texto.endswith(comilla):
            # Solo eliminar si las comillas envuelven TODO el texto
            texto_sin_comillas = texto[len(comilla):-len(comilla)].strip()
            # Verificar que no haya más comillas del mismo tipo en el medio
            # Si las hay, probablemente son parte del contenido
            if texto_sin_comillas.count(comilla) == 0 or texto_sin_comillas.count(comilla) % 2 == 0:
                texto = texto_sin_comillas
                break
    
    # Eliminar comillas dobles o simples que aparecen al inicio de frases
    # después de limpiar las comillas externas
    texto = texto.strip()
    
    # Patrones específicos que suelen generar las IAs
    patrones_innecesarios = [
        '""',  # Comillas dobles vacías
        "''",  # Comillas simples vacías
        '\"\"',  # Comillas dobles escapadas
    ]
    
    for patron in patrones_innecesarios:
        texto = texto.replace(patron, '')
    
    # Limpiar espacios adicionales que puedan haber quedado
    texto = ' '.join(texto.split())
    
    return texto

async def generar_descripcion_con_ai(prompt: str) -> str:
    """
    Envía el prompt a la API de IA configurada y obtiene la descripción generada.
    
    Args:
        prompt (str): El prompt construido para la IA
        
    Returns:
        str: La descripción generada por la IA
        
    Raises:
        HTTPException: Si hay errores de configuración, conexión o API
    """
    
    if not current_config or not current_config["key"]:
        raise HTTPException(
            status_code=500, 
            detail="Ninguna API key está configurada. Verifica GROQ_API_KEY, OPENAI_API_KEY o DEEPSEEK_API_KEY"
        )
    
    headers = {
        "Authorization": f"Bearer {current_config['key']}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": current_config["model"],
        "messages": [
            {
                "role": "system", 
                "content": "Eres un redactor empático especializado en descripciones para fomentar la adopción de mascotas. Redactas textos emocionales, cálidos y persuasivos que conectan con las familias adoptantes."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": current_config["max_tokens"]
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                current_config["url"],  # pyright: ignore[reportArgumentType]
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                error_detail = f"Error de {API_PROVIDER} API: {response.status_code}"
                try:
                    error_data = response.json()  # pyright: ignore[reportAny]
                    if isinstance(error_data, dict) and "error" in error_data:
                        error_message = error_data['error'].get('message', 'Error desconocido')  # pyright: ignore[reportUnknownVariableType, reportUnknownMemberType]
                        error_detail += f" - {error_message}"
                except Exception:
                    error_detail += f" - {response.text}"
                
                logger.error(error_detail)
                raise HTTPException(
                    status_code=500, 
                    detail=f"Error del servicio de IA ({API_PROVIDER}): {response.status_code}"
                )
            
            result = response.json()  # pyright: ignore[reportAny]
            # Extraer la descripción de forma segura
            try:
                descripcion = str(result["choices"][0]["message"]["content"]).strip()  # pyright: ignore[reportAny]
            except (KeyError, IndexError, TypeError) as e:
                logger.error(f"Estructura de respuesta inesperada: {e}")
                raise HTTPException(status_code=500, detail="Respuesta inválida del servicio de IA")
            
            # Limpiar comillas de forma más robusta
            descripcion = limpiar_comillas(descripcion)
            
            logger.info(f"Descripción generada exitosamente usando {API_PROVIDER}")
            return descripcion
            
    except httpx.TimeoutException:
        logger.error(f"Timeout al conectar con {API_PROVIDER} API")
        raise HTTPException(status_code=504, detail=f"Timeout del servicio de IA ({API_PROVIDER})")
    except httpx.RequestError as e:
        logger.error(f"Error de conexión con {API_PROVIDER} API: {e}")
        raise HTTPException(status_code=503, detail=f"Error de conexión con el servicio de IA ({API_PROVIDER})")
    except KeyError as e:
        logger.error(f"Respuesta inesperada de {API_PROVIDER} API: {e}")
        raise HTTPException(status_code=500, detail=f"Respuesta inválida del servicio de IA ({API_PROVIDER})")
    except Exception as e:
        logger.error(f"Error inesperado con {API_PROVIDER} API: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servicio de IA ({API_PROVIDER})")

@app.get("/")
async def root():
    """Endpoint de salud del servicio"""
    return {
        "mensaje": "Microservicio de Descripciones de Mascotas",
        "version": "1.0.0",
        "status": "activo"
    }

@app.get("/health")
async def health_check():
    """
    Endpoint de verificación de salud del servicio.
    
    Retorna información sobre el estado del servicio y las APIs disponibles.
    
    Returns:
        dict: Estado del servicio y configuración de APIs
    """
    available_apis: list[str] = []
    for provider, config in API_CONFIG.items():
        if config["key"]:
            available_apis.append(provider)
    
    return {
        "status": "healthy",
        "api_provider": API_PROVIDER,
        "available_apis": available_apis,
        "api_configured": bool(current_config and current_config["key"]),
        "model": current_config["model"] if current_config else None
    }

@app.post("/generar-descripcion", response_model=DescripcionResponse)
async def generar_descripcion(mascota: MascotaRequest):
    """
    Genera una descripción emocional para una mascota en adopción
    """
    
    if not current_config or not current_config["key"]:
        raise HTTPException(
            status_code=500, 
            detail=f"API key no configurada. Configura: {', '.join(API_CONFIG.keys())}"
        )
    
    logger.info(f"Generando descripción para mascota: {mascota.nombre} usando {API_PROVIDER}")
    
    try:
        # Construir el prompt
        prompt = construir_prompt(mascota)
        logger.info(f"Prompt construido: {len(prompt)} caracteres")
        
        # Generar descripción con IA
        descripcion = await generar_descripcion_con_ai(prompt)
        
        return DescripcionResponse(descripcion=descripcion)
        
    except HTTPException:
        # Re-lanzar excepciones HTTP
        raise
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Error interno del servidor"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # pyright: ignore[reportUnknownMemberType]
