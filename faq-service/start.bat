@echo off
REM Script de inicio para Windows

echo 🚀 Iniciando microservicio de descripciones de mascotas...

REM Verificar si existe el entorno virtual
if not exist "venv" (
    echo 📦 Creando entorno virtual...
    python -m venv venv
)

REM Activar entorno virtual
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate

REM Instalar dependencias
echo 📥 Instalando dependencias...
pip install -r requirements.txt

REM Verificar archivo .env
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado. Copiando desde .env.example...
    copy .env.example .env
    echo 🔑 Por favor, edita el archivo .env y agrega tu DEEPSEEK_API_KEY
    echo 📝 Puedes obtener una API key en: https://platform.deepseek.com/
    pause
    exit /b 1
)

REM Iniciar el servicio
echo 🌟 Iniciando servicio en http://localhost:8001
python main.py

pause
