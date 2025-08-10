"""
Configuración centralizada para el microservicio de descripciones de mascotas.

Este módulo maneja toda la configuración del servicio utilizando Pydantic Settings
para validación automática de tipos y carga de variables de entorno.

Autor: Equipo AdoptaFácil
Versión: 1.0.0
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Configuración principal del servicio usando Pydantic Settings.
    
    Todas las configuraciones pueden ser sobrescritas mediante variables
    de entorno o archivo .env.
    """
    
    # === Configuración de APIs de IA ===
    deepseek_api_key: str = ""  # API key para DeepSeek
    groq_api_key: str = ""      # API key para Groq (alternativa)
    openai_api_key: str = ""    # API key para OpenAI (alternativa)
    
    # === Configuración del servidor ===
    host: str = "0.0.0.0"       # Host del servidor (0.0.0.0 permite conexiones externas)
    port: int = 8001            # Puerto del servidor
    
    # === Configuración de APIs ===
    deepseek_api_url: str = "https://api.deepseek.com/v1/chat/completions"
    groq_api_url: str = "https://api.groq.com/openai/v1/chat/completions"
    openai_api_url: str = "https://api.openai.com/v1/chat/completions"
    
    # === Parámetros de IA ===
    timeout: int = 30           # Timeout en segundos para requests
    max_tokens: int = 200       # Máximo tokens para respuestas (descripciones concisas)
    temperature: float = 0.7    # Creatividad de la IA (0.0-1.0)
    
    # === Configuración CORS ===
    allowed_origins: list[str] = ["*"]  # Dominios permitidos (* para desarrollo)
    
    # === Configuración de logging ===
    log_level: str = "INFO"     # Nivel de logging (DEBUG, INFO, WARNING, ERROR)
    
    class Config:
        """Configuración de Pydantic Settings."""
        env_file: str = ".env"
        env_file_encoding: str = "utf-8"
        env_prefix: str = ""


# Instancia global de configuración
settings = Settings()


def get_available_api_providers() -> list[str]:
    """
    Retorna una lista de proveedores de IA con API keys configuradas.
    
    Returns:
        list[str]: Lista de proveedores disponibles
    """
    providers: list[str] = []
    
    if settings.deepseek_api_key:
        providers.append("deepseek")
    if settings.groq_api_key:
        providers.append("groq")
    if settings.openai_api_key:
        providers.append("openai")
    
    return providers


def get_primary_api_provider() -> str | None:
    """
    Retorna el proveedor de IA principal disponible.
    
    Prioridad: Groq > DeepSeek > OpenAI (por costo/velocidad)
    
    Returns:
        str | None: Nombre del proveedor principal o None si ninguno está configurado
    """
    if settings.groq_api_key:
        return "groq"
    elif settings.deepseek_api_key:
        return "deepseek"
    elif settings.openai_api_key:
        return "openai"
    else:
        return None
