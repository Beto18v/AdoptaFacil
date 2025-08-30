# Define los modelos de datos (Pydantic) utilizados para las solicitudes y respuestas del chatbot FAQ.
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
