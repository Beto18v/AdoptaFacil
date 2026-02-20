https://deepwiki.com/search/genera-un-checklist-de-desplie_f28dbc66-2571-4fed-8096-9a88e6bdbeb5?mode=deep

Checklist de Despliegue - AdoptaFacil

1. Variables de Entorno Requeridas
   1.1 Laravel Backend (laravel12-react) .env.example:1-70
   Variables Críticas:

APP_KEY - Generar con php artisan key:generate
APP_ENV - Configurar como production
APP_DEBUG - Configurar como false en producción
APP_URL - URL de producción
Base de Datos:

DB_CONNECTION=pgsql
DB_HOST - Host de PostgreSQL
DB_PORT=5432
DB_DATABASE=adoptafacil
DB_USERNAME - Usuario de base de datos
DB_PASSWORD - Contraseña de base de datos
Autenticación OAuth:

GOOGLE_CLIENT_ID - Para login con Google
GOOGLE_CLIENT_SECRET - Para login con Google
GOOGLE_REDIRECT_URI - Callback URL
Email/SMTP (si se usa):

MAIL_MAILER
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
MAIL_FROM_ADDRESS
Colas y Cache:

QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database
1.2 Chatbot FAQ Service (FastAPI)
No requiere variables de entorno específicas - el servicio es stateless y usa configuración en código.

2. Comandos de Build
   2.1 Laravel Backend package.json:4-11

# Instalar dependencias PHP

composer install --no-dev --optimize-autoloader

# Instalar dependencias Node.js

npm ci

# Build de assets (Vite + React)

npm run build

# Optimizar configuración Laravel

php artisan config:cache  
php artisan route:cache  
php artisan view:cache
2.2 Chatbot FAQ Service (Python/FastAPI) requirements.txt:1-4
cd chatbot-faq-service

# Crear entorno virtual (recomendado)

python -m venv venv  
source venv/bin/activate # En Windows: venv\Scripts\activate

# Instalar dependencias

pip install -r requirements.txt 3. Migraciones de Base de Datos composer.json:57
Migraciones disponibles (en orden): 0001_01_01_000000_create_users_table.php:1 0001_01_01_000001_create_cache_table.php:1 0001_01_01_000002_create_jobs_table.php:1

Y migraciones del dominio de negocio (mascotas, refugios, donaciones, posts, etc.)

Comandos:

# Ejecutar migraciones

php artisan migrate --force

# Verificar estado

php artisan migrate:status

# Rollback si es necesario

php artisan migrate:rollback 4. Seeders DatabaseSeeder.php:10-25
Orden de ejecución de seeders: DatabaseSeeder.php:33-81

UserSeeder - Usuarios base del sistema
ShelterSeeder - Refugios y mascotas
ProductSeeder - Productos para la tienda
PostSeeder - Publicaciones de comunidad
CommentSeeder - Comentarios en publicaciones
DonationSeeder - Donaciones para refugios
PostLikeSeeder - Likes en publicaciones
FavoritoSeeder - Mascotas favoritas
SolicitudSeeder - Solicitudes de adopción
DashboardDataSeeder - Datos para métricas del dashboard
Comandos:

# Ejecutar todos los seeders

php artisan db:seed --force

# Ejecutar seeder específico

php artisan db:seed --class=UserSeeder --force

# Migración + Seed en un comando

php artisan migrate:fresh --seed --force
⚠️ Nota: En producción, evalúa cuidadosamente si necesitas los seeders, ya que crean datos de prueba.

5. Health Checks
   5.1 Endpoints de Health Check por Servicio WelcomeEmailController.java:23-26
   Laravel Backend (Puerto 8000):

GET /up - Health check nativo de Laravel 11+
Chatbot FAQ Service (Puerto 8001): main.py:25-27

GET / - Retorna {"message": "Chatbot FAQ Service is running"}
5.2 Script de Verificación de Health Checks
#!/bin/bash  
echo "Verificando servicios..."

# Laravel

curl -f http://localhost:8000/up || echo "❌ Laravel no disponible"

# Chatbot Service

curl -f http://localhost:8001/ || echo "❌ Chatbot Service no disponible"

echo "✅ Verificación completada" 6. Smoke Tests Post-Deploy
6.1 Tests de Laravel composer.json:68-71

# Ejecutar suite de tests

php artisan test

# O con Pest

./vendor/bin/pest
6.2 Tests Funcionales Críticos
Autenticación:

Login con email/password funciona
Login con Google OAuth funciona
Registro de nuevos usuarios funciona
Recuperación de contraseña funciona
Funcionalidades Core:

Listado de mascotas disponibles se muestra
Búsqueda y filtros funcionan
Solicitud de adopción se crea correctamente
Sistema de favoritos funciona
Publicaciones en comunidad se crean
Microservicios:

Generación de PDF de estadísticas funciona
6.3 Verificación de Integraciones
Chatbot Service:

# Test de respuesta del chatbot

curl -X POST http://localhost:8001/chat/ \  
 -H "Content-Type: application/json" \  
 -d '{"message": "¿Qué es AdoptaFácil?"}'
6.4 Verificación de Base de Datos

# Verificar conexión a PostgreSQL

php artisan tinker

# Ejecutar: DB::connection()->getPdo();

# Verificar tablas principales

php artisan tinker

# Ejecutar: \App\Models\User::count();

# Ejecutar: \App\Models\Mascota::count();

7. Iniciar Servicios en Producción
   7.1 Laravel Backend

# Con servidor PHP-FPM + Nginx (recomendado)

# Configurar Nginx para servir public/index.php

# O con Laravel Octane

php artisan octane:start --host=0.0.0.0 --port=8000

# Worker de colas (en segundo plano)

php artisan queue:work --daemon
7.2 Chatbot Service main.py:6-10
cd chatbot-faq-service

# Con Uvicorn

uvicorn app.main:app --host 0.0.0.0 --port 8001

# Con Gunicorn (producción)

gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001 8. Configuración Post-Deploy
Verificar permisos de directorios storage/ y bootstrap/cache/
Configurar SSL/TLS (HTTPS)
Configurar CORS si es necesario
Configurar firewall para puertos necesarios
Configurar logs y monitoreo
Configurar backups automáticos de base de datos
Verificar cronjobs de Laravel (php artisan schedule:work)
Notes
Importante sobre la arquitectura:

El proyecto AdoptaFacil utiliza una arquitectura de microservicios con 2 servicios independientes: Laravel (backend principal) y Chatbot FAQ Service (Python/FastAPI).
Todos los servicios comparten la misma base de datos PostgreSQL excepto el Chatbot que es stateless.
El servicio de Chatbot no requiere variables de entorno adicionales, pero debe estar ejecutándose en el puerto 8001 para que el widget del frontend pueda conectarse.
Sobre los tests:
El proyecto incluye tests automatizados con Pest/PHPUnit para Laravel, pero no se encontraron tests automatizados para el microservicio de Python. Los smoke tests post-deploy deben realizarse manually o crearse scripts personalizados.
