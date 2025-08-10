#!/bin/bash

# Script de inicio para el microservicio de descripciones de mascotas

echo "🚀 Iniciando microservicio de descripciones de mascotas..."

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📥 Instalando dependencias..."
pip install -r requirements.txt

# Verificar archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde .env.example..."
    cp .env.example .env
    echo "🔑 Por favor, edita el archivo .env y agrega tu DEEPSEEK_API_KEY"
    echo "📝 Puedes obtener una API key en: https://platform.deepseek.com/"
    exit 1
fi

# Iniciar el servicio
echo "🌟 Iniciando servicio en http://localhost:8001"
python main.py
