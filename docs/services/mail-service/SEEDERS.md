# Documentación de Seeders - AdoptaFácil

Esta documentación describe los seeders disponibles en el proyecto Laravel para poblar la base de datos con datos de ejemplo.

## Seeders Disponibles

### 1. UserSeeder

**Ubicación:** `database/seeders/UserSeeder.php`

**Propósito:**
Crea usuarios predeterminados para cada rol principal del sistema:

- **Admin**: Usuario administrador con acceso completo (`admin@demo.com`)
- **Aliado**: Usuario representante de refugios (`aliado@demo.com`)
- **Cliente**: Usuario adoptante/comprador (`cliente@demo.com`)

**Datos creados:**

- Nombre, email único, contraseña encriptada (`Password123`), rol asignado
- Campo `avatar` opcional (null por defecto)

**Comportamiento:** Usa `firstOrCreate()` para evitar duplicados.

### 2. ShelterSeeder

**Ubicación:** `database/seeders/ShelterSeeder.php`

**Propósito:**
Crea una red de refugios de mascotas distribuidos en ciudades colombianas principales.

**Datos creados:**

- **Usuarios aliados:** Uno por cada refugio con rol 'aliado'
- **Refugios:** Información completa incluyendo dirección, teléfono, datos bancarios
- **Mascotas:** 5-15 mascotas por refugio con especies variadas (perros, gatos, conejos, aves)

**Ciudades incluidas:**

- Bogotá (3 refugios)
- Medellín (2 refugios)
- Cali (2 refugios)
- Barranquilla, Cartagena, Bucaramanga (1 refugio cada una)

**Comportamiento:** Evita duplicados usando `firstOrCreate()` para usuarios y refugios.

### 3. ProductSeeder

**Ubicación:** `database/seeders/ProductSeeder.php`

**Propósito:**
Puebla la tienda en línea con productos para mascotas.

**Datos creados:**

- Alimentos premium para perros y gatos
- Accesorios y juguetes
- Productos de higiene y cuidado
- Medicamentos y suplementos

**Características:**

- Precios en pesos colombianos
- Stock variable por producto
- Asociados a usuarios con rol 'aliado'
- Requiere que existan usuarios aliados previamente

**Comportamiento:** Usa `firstOrCreate()` para evitar duplicados.

### 4. PostSeeder

**Ubicación:** `database/seeders/PostSeeder.php`

**Propósito:**
Crea publicaciones de ejemplo para la sección de comunidad.

**Datos creados:**

- Campañas de esterilización y adopción
- Noticias sobre la plataforma
- Consejos para cuidado de mascotas
- Solicitudes de ayuda urgente

**Características:**

- Contenido realista con emojis y formato
- Categorías: Campaña, Noticia, Consejo
- Métricas de engagement (likes, comentarios)
- URLs de imágenes de ejemplo

**Comportamiento:** Requiere usuarios existentes. Usa `firstOrCreate()` para evitar duplicados.

### 5. DashboardDataSeeder

**Ubicación:** `database/seeders/DashboardDataSeeder.php`

**Propósito:**
Genera datos de ejemplo para métricas y estadísticas del dashboard administrativo.

**Datos creados:**

- **Donaciones:** Registros de donaciones con diferentes montos y fechas
- **Solicitudes:** Solicitudes de adopción de ejemplo (si existen mascotas y usuarios)

**Características:**

- Fechas históricas para mostrar tendencias
- Estados de solicitud: aprobada, pendiente
- Información completa de solicitantes

**Comportamiento:** Solo crea datos si no existen previamente.

## Orden de Ejecución

Los seeders están configurados en `DatabaseSeeder.php` en el siguiente orden:

1. **UserSeeder** - Primero, crea usuarios base
2. **ShelterSeeder** - Crea refugios y mascotas
3. **ProductSeeder** - Crea productos asociados a aliados
4. **PostSeeder** - Crea publicaciones
5. **DashboardDataSeeder** - Crea datos para dashboard

## Cómo Ejecutar

### Ejecutar todos los seeders:

```bash
php artisan db:seed
```

### Ejecutar un seeder específico:

```bash
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ShelterSeeder
php artisan db:seed --class=ProductSeeder
php artisan db:seed --class=PostSeeder
php artisan db:seed --class=DashboardDataSeeder
```

### Forzar refresh de la base de datos con seeders:

```bash
php artisan migrate:fresh --seed
```

## Notas Importantes

- Todos los seeders usan `firstOrCreate()` o verificaciones de existencia para evitar duplicados
- Las contraseñas están encriptadas usando `Hash::make()`
- Los emails son únicos y fáciles de identificar para testing
- Los datos están en español apropiados para el contexto colombiano
- Las imágenes son URLs externas de Unsplash (pueden no cargar en producción)

## Dependencias entre Seeders

- **ProductSeeder** requiere que existan usuarios con rol 'aliado' (creados por UserSeeder o ShelterSeeder)
- **PostSeeder** requiere que existan usuarios
- **DashboardDataSeeder** requiere mascotas y usuarios para crear solicitudes

## Campos Requeridos Ajustados

Durante el desarrollo, se identificaron y corrigieron los siguientes campos requeridos en los modelos:

- **Mascota**: `sexo`, `ciudad`
- **Solicitud**: `cedula`, `email`, `direccion_ciudad`, `direccion_barrio`, `tipo_vivienda`, `porque_adopta`

## Credenciales de Prueba

| Rol     | Email            | Contraseña  |
| ------- | ---------------- | ----------- |
| Admin   | admin@demo.com   | Password123 |
| Aliado  | aliado@demo.com  | Password123 |
| Cliente | cliente@demo.com | Password123 |

Los refugios adicionales tienen emails como `refugiobogota1@example.com`, etc.
