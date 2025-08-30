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
    allow_origins=[
        "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174",
        "http://127.0.0.1:8000", "http://localhost:8000", "https://adoptafacil.up.railway.app/"
    ],  # URLs del frontend y producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Chatbot FAQ Service is running"}
