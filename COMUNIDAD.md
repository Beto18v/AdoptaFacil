# Funcionalidad de Comunidad - AdoptaFácil

## Descripción

La funcionalidad de comunidad permite a los usuarios registrados crear, ver e interactuar con publicaciones relacionadas al bienestar animal.

## Características Implementadas

### 🔐 Autenticación y Autorización

- Solo usuarios autenticados pueden crear publicaciones
- Los usuarios pueden eliminar únicamente sus propias publicaciones
- Sistema de políticas (PostPolicy) para gestión de permisos
- Middleware de autenticación en rutas sensibles

### 📝 Gestión de Publicaciones

- **Crear publicaciones**: Texto, categoría e imagen opcional
- **Categorías disponibles**: Campaña, Noticia, Consejo, General
- **Límites**: 1000 caracteres de texto, imágenes máximo 2MB
- **Estados**: Publicaciones activas/inactivas con soft deletes

### 💖 Interacciones

- Sistema de "Me gusta" para publicaciones
- Contador de comentarios (preparado para futuras implementaciones)
- Botón de compartir (preparado para redes sociales)

### 🎨 Interfaz de Usuario

- Diseño responsivo con Tailwind CSS
- Modo claro/oscuro
- Componentes reutilizables con TypeScript
- Feedback visual para acciones (loading, success, errors)

## Estructura de Archivos

### Backend (Laravel)

```
app/
├── Models/
│   ├── Post.php                    # Modelo de publicaciones
│   └── User.php                    # Relación con posts
├── Http/Controllers/
│   └── CommunityController.php     # Controlador principal
├── Policies/
│   └── PostPolicy.php              # Políticas de autorización
└── Console/Commands/
    └── CommunityStatsCommand.php   # Comando de estadísticas

database/
├── migrations/
│   └── *_create_posts_table.php    # Estructura de BD
└── seeders/
    └── PostSeeder.php              # Datos de ejemplo
```

### Frontend (React + TypeScript)

```
resources/js/
├── pages/
│   └── comunidad.tsx               # Página principal
└── components/comunidad/
    ├── create-post.tsx             # Formulario de creación
    ├── post-card.tsx               # Tarjeta de publicación
    ├── post-filters.tsx            # Filtros laterales
    ├── trending-topics.tsx         # Tendencias
    └── comunity-hero.tsx           # Banner principal
```

## Rutas Disponibles

### Web Routes

- `GET /comunidad` - Página principal de comunidad
- `POST /comunidad/posts` - Crear nueva publicación (auth)
- `POST /comunidad/posts/{post}/like` - Dar like (auth)
- `DELETE /comunidad/posts/{post}` - Eliminar publicación (auth + owner)

## Base de Datos

### Tabla `posts`

- `id` - ID único
- `user_id` - Relación con usuario
- `content` - Contenido del post (máximo 1000 caracteres)
- `image_url` - URL de imagen opcional
- `category` - Categoría (enum)
- `likes_count` - Contador de likes
- `comments_count` - Contador de comentarios
- `is_active` - Estado activo/inactivo
- `created_at/updated_at` - Timestamps
- `deleted_at` - Soft delete

## Comandos Artisan

### Estadísticas de Comunidad

```bash
# Estadísticas básicas
php artisan community:stats

# Estadísticas detalladas
php artisan community:stats --detailed
```

### Seeders

```bash
# Ejecutar seeder de posts
php artisan db:seed --class=PostSeeder

# Ejecutar todos los seeders
php artisan db:seed
```

## Configuración de Desarrollo

### Requisitos

- PHP 8.1+
- Node.js 18+
- SQLite (configurado por defecto)

### Instalación

1. Clonar el repositorio
2. `composer install`
3. `npm install`
4. `cp .env.example .env`
5. `php artisan key:generate`
6. `php artisan migrate --seed`
7. `npm run dev`

### Compilar Assets

```bash
# Desarrollo con hot reload
npm run dev

# Producción
npm run build
```

## Funcionalidades Futuras

### A Implementar

- [ ] Sistema de comentarios completo
- [ ] Notificaciones en tiempo real
- [ ] Compartir en redes sociales
- [ ] Filtros avanzados por categoría/fecha
- [ ] Sistema de moderación
- [ ] Búsqueda de publicaciones
- [ ] Hashtags y menciones
- [ ] Galería de imágenes múltiples
- [ ] Reportes de contenido

### Mejoras Técnicas

- [ ] Paginación infinita
- [ ] Cache de publicaciones populares
- [ ] Optimización de imágenes
- [ ] API REST completa
- [ ] Tests automatizados
- [ ] Métricas de engagement

## Consideraciones de Seguridad

- ✅ Validación de entrada de datos
- ✅ Autorización basada en políticas
- ✅ Protección CSRF (Laravel)
- ✅ Límites de tamaño de archivo
- ✅ Sanitización de contenido
- ⚠️ **Pendiente**: Rate limiting para creación de posts
- ⚠️ **Pendiente**: Moderación de contenido
- ⚠️ **Pendiente**: Prevención de spam

## Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT License - Ver archivo LICENSE para más detalles.
