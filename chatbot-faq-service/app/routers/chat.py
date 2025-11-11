# chat.py
# Define los endpoints de la API y el flujo de conversación del chatbot FAQ.
# Orquesta cómo se recibe la pregunta, se busca la respuesta y se responde al usuario.
# Aquí se pueden personalizar saludos, fallback y lógica de integración.

# Define los endpoints relacionados con el chatbot FAQ, procesando preguntas y generando respuestas.
from fastapi import APIRouter, Response
from ..schemas import ChatRequest, ChatResponse
from ..fuzzy_matcher import get_fuzzy_response
from ..faqs import search_faqs_by_keywords

router = APIRouter(prefix="/chat", tags=["chat"])

def get_chatbot_response(message: str) -> str:
    """
    Get chatbot response using fuzzy matching against FAQ database.
    Falls back to keyword-based matching if fuzzy matching fails.
    """
    message_lower = message.lower().strip()

    # First try fuzzy matching
    fuzzy_response = get_fuzzy_response(message)
    if fuzzy_response:
        return fuzzy_response

    # Fallback to keyword-based matching
    keyword_results = search_faqs_by_keywords(message)
    if keyword_results:
        faq = keyword_results[0]  # Take the first match
        return str(faq["answer"])

    # Basic greetings and common responses
    if any(word in message_lower for word in ["hola", "buenas", "saludos", "hello", "hi"]):
        return "¡Hola! Soy tu asistente de AdoptaFácil 🐾. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre adopciones, registro, mascotas, o cualquier aspecto de la plataforma."

    if any(word in message_lower for word in ["gracias", "thanks", "thank you"]):
        return "¡De nada! Estoy aquí para ayudarte con cualquier pregunta sobre AdoptaFácil. ¿Hay algo más que quieras saber?"

    if any(word in message_lower for word in ["adios", "bye", "chau", "hasta luego"]):
        return "¡Hasta luego! Recuerda que puedes volver cuando necesites ayuda con AdoptaFácil. ¡Cuida mucho a tu mascota! 🐕🐱"

    # Default response with suggestions
    return "Lo siento, no pude encontrar una respuesta exacta para tu pregunta. Soy un chatbot especializado en AdoptaFácil y puedo ayudarte con temas como:\n\n• Registro y cuentas de usuario\n• Publicar mascotas para adopción\n• Proceso de adopción\n• Comunidad y consejos\n• Productos para mascotas\n• Donaciones a refugios\n\n¿Podrías reformular tu pregunta o elegir uno de estos temas?"

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = get_chatbot_response(request.message)
    return ChatResponse(reply=reply)

# Handler explícito para OPTIONS (preflight CORS)
@router.options("/")
async def chat_options():
    return Response(status_code=204)
