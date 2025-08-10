# 🚀 GUÍA RÁPIDA: API GRATUITA PARA DESCRIPCIONES DE MASCOTAS

## ✅ **OPCIÓN 1: Groq (RECOMENDADO - COMPLETAMENTE GRATUITO)**

### 📝 Pasos para obtener API Key de Groq:

1. **Ir a Groq Console**: https://console.groq.com/
2. **Registrarse**: Usar email o GitHub
3. **Verificar email** (si es necesario)
4. **Ir a API Keys**: En el menú lateral, click en "API Keys"
5. **Crear nueva key**: Click en "Create API Key"
6. **Copiar la key**: Guarda la key generada

### ⚡ **Características de Groq:**

- ✅ **100% Gratuito** - Sin límites de créditos
- ✅ **Súper rápido** - Inferencia en tiempo real
- ✅ **Modelos potentes** - Llama 3, Mixtral, Gemma
- ✅ **Sin tarjeta de crédito** requerida

### 🔧 **Configurar en el microservicio:**

```env
# En tu archivo .env
API_PROVIDER=groq
GROQ_API_KEY=tu_key_aqui_de_groq
```

---

## ✅ **OPCIÓN 2: OpenAI (CAPA GRATUITA LIMITADA)**

### 📝 Pasos para OpenAI:

1. **Ir a OpenAI**: https://platform.openai.com/
2. **Registrarse**: Crear cuenta
3. **Verificar teléfono**: Necesario para créditos gratuitos
4. **Ir a API Keys**: Dashboard → API Keys
5. **Crear nueva key**: "+ Create new secret key"

### 💰 **Características de OpenAI:**

- 🆓 **$5 USD gratis** al registrarse
- ⏰ **Expira en 3 meses** si no se usa
- 🎯 **GPT-3.5-turbo** muy bueno para descripciones
- 💳 **Requiere tarjeta** para continuar después

### 🔧 **Configurar:**

```env
# En tu archivo .env
API_PROVIDER=openai
OPENAI_API_KEY=sk-tu_key_aqui
```

---

## ✅ **OPCIÓN 3: DeepSeek (NECESITA CRÉDITOS)**

Ya tienes la key configurada, pero necesitas agregar balance:

- Ve a: https://platform.deepseek.com/
- Agrega créditos a tu cuenta
- Generalmente ofrecen créditos iniciales gratuitos

---

## 🏃‍♂️ **PASOS RÁPIDOS (Groq)**

1. **Obtener Groq API Key**: https://console.groq.com/
2. **Editar tu archivo `.env`**:
   ```env
   API_PROVIDER=groq
   GROQ_API_KEY=tu_key_real_aqui
   ```
3. **Reiniciar el microservicio**:

   ```bash
   # Detener con Ctrl+C si está corriendo
   cd faq-service
   .\venv\Scripts\Activate.ps1
   python main.py
   ```

4. **Probar**: http://localhost:8001/health

---

## 🧪 **PROBAR EL MICROSERVICIO**

Una vez configurada cualquier API key:

```bash
# Ejecutar pruebas
python test_service.py

# O probar manualmente
curl -X POST http://localhost:8001/generar-descripcion \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Luna",
    "especie": "Perro",
    "raza": "Mestiza",
    "personalidad": "Juguetona y cariñosa",
    "salud": "Excelente estado",
    "observaciones": "Le encantan los niños"
  }'
```

---
