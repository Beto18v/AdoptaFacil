# Define los endpoints relacionados con el chatbot FAQ, procesando preguntas y generando respuestas.
from fastapi import APIRouter
from ..schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])

def get_chatbot_response(message: str) -> str:
    message_lower = message.lower()
    
    # Reglas de respuesta basadas en palabras clave
    rules = [
        (["hola", "buenas", "saludos"], "¡Hola! ¿En qué puedo ayudarte hoy?"),
        (["registro", "registrar"], "Sí, el registro es completamente gratuito para todas las opciones de cuenta."),
        (["cambiar", "cuenta"], "Claro, solo necesitas completar información adicional para actualizar tu cuenta."),
        (["documento", "papeles"], "Depende del tipo de cuenta. Fundaciones deben adjuntar soporte legal."),
        (["proceso", "adopción"], "El proceso incluye llenar un formulario, una entrevista y la firma del acuerdo de adopción."),
        (["costo", "precio", "pagar"], "La adopción no tiene costo, pero pedimos cubrir vacunas y esterilización."),
        (["requisito", "necesito"], "Necesitas ser mayor de edad y completar los formularios correspondientes."),
        (["ubicación", "dónde"], "Puedes verificar donde se encuentran los refugios más cercanos registrandote y dirigiendote al apartado de mapa."),
        (["vacuna", "esterilización"], "Sí, todas las mascotas se entregan vacunadas y esterilizadas según su edad."),
        (["otra mascota", "ya tengo"], "Sí, siempre que tus mascotas actuales estén vacunadas y socializadas."),
        (["devolver", "regresar"], "Las devoluciones responsables dependen de las politicas del refugio."),
        (["voluntario", "donar", "ayudar"], "¡Claro! Puedes unirte como voluntario en diferentes actividades de cuidado y rescate, tambien puedes apoyar a un refugio dondando para su causa en el apartado de refugios.")
    ]
    
    for keywords, response in rules:
        if any(keyword in message_lower for keyword in keywords):
            return response
    
    # Respuesta por defecto
    return "Soy tu asistente de adopciones 🐾. Puedes preguntarme sobre registro, documentos, requisitos, proceso, ubicación, horarios, costos o voluntariado."

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = get_chatbot_response(request.message)
    return ChatResponse(reply=reply)
