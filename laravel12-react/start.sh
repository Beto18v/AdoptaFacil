#!/bin/sh

# Salir inmediatamente si un comando falla
set -e

# Crear las carpetas necesarias dentro del volumen de storage
echo "Creating storage directories..."
mkdir -p /app/storage/framework/cache/data
mkdir -p /app/storage/framework/sessions
mkdir -p /app/storage/framework/views
mkdir -p /app/storage/logs
mkdir -p /app/storage/app/public

# Asignar los permisos correctos
chmod -R 775 /app/storage
chown -R www-data:www-data /app/storage

# Revisar si la tabla shared_links existe
echo "Checking if 'shared_links' table exists..."
if php /app/artisan db:query "SHOW TABLES LIKE 'shared_links';" | grep -q "shared_links"; then
    echo "'shared_links' table found. Running migrate:fresh..."
    php /app/artisan migrate:fresh --force
else
    echo "'shared_links' table not found. Running normal migrate..."
    php /app/artisan migrate --force
fi

# Crear el enlace simbólico para las imágenes públicas
echo "Linking storage..."
php /app/artisan storage:link

# Iniciar el servidor de la aplicación
echo "Starting Laravel server..."
php /app/artisan serve --host=0.0.0.0 --port=${PORT:-8000}
