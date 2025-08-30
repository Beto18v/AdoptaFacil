# Punto de entrada principal de la aplicación FastAPI para el microservicio Chatbot FAQ Service.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import chat

app = FastAPI(
    title="Chatbot FAQ Service",
    description="Microservicio para chatbot de preguntas frecuentes sobre adopción de mascotas",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat.router)


@app.get("/")
async def root():
    return {"message": "Chatbot FAQ Service is running"}
