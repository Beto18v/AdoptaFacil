# Documentación Completa de AdoptaFácil 🏠

## Descripción General del Proyecto

AdoptaFácil es una plataforma web integral desarrollada con Laravel 12 y React que facilita el proceso de adopción de mascotas en Colombia. La plataforma combina funcionalidades de red social, marketplace y sistema de gestión para crear un ecosistema completo alrededor del bienestar animal.

## Tecnologías Principales

- **Backend**: Laravel 12 con PHP 8.2+
- **Frontend**: React 18 con TypeScript
- **Base de Datos**: MySQL 8.0+
- **Comunicación**: Inertia.js para SPA
- **Estilización**: Tailwind CSS
- **Autenticación**: Laravel Breeze
- **Pagos**: MercadoPago, PayPal
- **Testing**: PHPUnit, Pest

## Arquitectura del Sistema

### Stack Tecnológico

```
Frontend (React/TypeScript)
       ↕ Inertia.js
Backend (Laravel 12/PHP)
       ↕ Eloquent ORM
Base de Datos (MySQL)
```

### Estructura de Directorios Principales

```
laravel12-react/
├── app/
│   ├── Http/Controllers/     # Controladores principales
│   ├── Models/              # Modelos Eloquent
│   ├── Policies/            # Políticas de autorización
│   └── Http/Requests/       # Validaciones
├── resources/
│   ├── js/pages/           # Páginas React
│   ├── js/components/      # Componentes reutilizables
│   └── js/layouts/         # Layouts principales
├── routes/
│   ├── web.php            # Rutas web principales
│   ├── api.php            # Rutas API
│   └── auth.php           # Rutas de autenticación
├── database/
│   ├── migrations/        # Migraciones de BD
│   └── seeders/          # Datos de prueba
└── docs/                 # Documentación (NUEVA)
```

## Módulos del Sistema

AdoptaFácil está organizado en **6 módulos principales**, cada uno con documentación detallada:

### 1. 🐕 [Módulo de Gestión de Mascotas](./MODULO_MASCOTAS.md)

**Funcionalidad principal**: Registro, visualización y gestión de mascotas disponibles para adopción.

**Características clave**:

- Catálogo público de mascotas
- Sistema de múltiples imágenes (hasta 3 por mascota)
- Cálculo automático de edad
- Filtros por especie, ubicación y características
- Sistema de favoritos

**Archivos principales**:

- `MascotaController.php` - Controlador principal
- `Mascota.php` - Modelo principal
- `mascotas.tsx` - Vista pública del catálogo
- `MascotaPolicy.php` - Políticas de autorización

---

### 2. 🛍️ [Módulo de Gestión de Productos](./MODULO_PRODUCTOS.md)

**Funcionalidad principal**: Marketplace para productos relacionados con el cuidado de mascotas.

**Características clave**:

- Catálogo de productos para aliados comerciales
- Sistema de inventario y stock
- Múltiples imágenes por producto
- Dashboard unificado con mascotas
- Gestión de precios y categorías

**Archivos principales**:

- `ProductController.php` - Controlador principal
- `Product.php` - Modelo principal
- `productos.tsx` - Vista pública de productos
- `ProductPolicy.php` - Autorización de productos

---

### 3. 👥 [Módulo de Gestión de Usuarios](./MODULO_USUARIOS.md)

**Funcionalidad principal**: Autenticación, autorización y gestión de perfiles de usuario.

**Características clave**:

- Sistema de roles (user, commercial_ally, admin, moderator)
- Autenticación con Laravel Starter Pack
- Verificación de email obligatoria
- Gestión de perfiles y avatares
- Recuperación de contraseñas

**Archivos principales**:

- `AuthController.php` - Autenticación
- `User.php` - Modelo de usuario
- `auth/` - Páginas de autenticación
- Middleware de autorización

---

### 4. 📋 [Módulo de Solicitudes de Adopción](./MODULO_SOLICITUDES.md)

**Funcionalidad principal**: Gestión completa del proceso de adopción entre adoptantes y dueños.

**Características clave**:

- Formulario detallado de solicitud
- Estados de seguimiento (pendiente, aprobada, rechazada)
- Sistema de notificaciones automáticas
- Dashboard para adoptantes y dueños
- Historial completo del proceso

**Archivos principales**:

- `SolicitudesController.php` - Gestión de solicitudes
- `AccionSolicitudController.php` - Acciones específicas
- `Solicitud.php` - Modelo principal
- Dashboard de seguimiento

---

### 5. 💬 [Módulo de Comunidad](./MODULO_COMUNIDAD.md)

**Funcionalidad principal**: Red social especializada en mascotas y experiencias de adopción.

**Características clave**:

- Feed de publicaciones con tipos específicos
- Sistema de likes y comentarios anidados
- Compartir historias y consejos
- Moderación de contenido
- Interacciones sociales

**Archivos principales**:

- `CommunityController.php` - Gestión de comunidad
- `SharedController.php` - Sistema de compartir
- `Post.php`, `Comment.php` - Modelos sociales
- `comunidad.tsx` - Vista principal

---

### 6. 📊 [Módulo de Dashboard y Analytics](./MODULO_DASHBOARD.md)

**Funcionalidad principal**: Panel de control con métricas y estadísticas de la plataforma.

**Características clave**:

- Estadísticas principales de la plataforma
- Gráficos interactivos de tendencias
- Métricas de crecimiento y comparación
- Actividad reciente del sistema
- Personalización por rol de usuario

**Archivos principales**:

- `DashboardController.php` - Controlador principal
- `EstadisticasController.php` - Estadísticas avanzadas
- `dashboard.tsx` - Vista principal
- Componentes de gráficos y métricas

---

### 7. 💰 [Módulo de Donaciones y Pagos](./MODULO_DONACIONES.md)

**Funcionalidad principal**: Sistema completo de donaciones y procesamiento de pagos.

**Características clave**:

- Donaciones para la plataforma y refugios específicos
- Generación automática de recibos
- Dashboard de donaciones por usuario
- Webhooks y confirmaciones automáticas

**Archivos principales**:

- `DonacionesController.php` - Gestión de donaciones
- `PagoController.php` - Procesamiento de pagos
- `Donation.php` - Modelo principal
- Integración con pasarelas de pago

## Flujo Principal de Usuario

### Para Adoptantes

1. **Registro** → Verificación de email → **Dashboard**
2. **Explorar mascotas** → Filtrar por preferencias → **Ver detalles**
3. **Agregar favoritos** → **Solicitar adopción** → Completar formulario
4. **Seguimiento** → Recibir respuesta → **Coordinar entrega**
5. **Participar en comunidad** → Compartir experiencia

### Para Dueños de Mascotas

1. **Registro** → **Verificar cuenta** → **Dashboard**
2. **Registrar mascota** → Subir fotos → **Publicar**
3. **Recibir solicitudes** → **Evaluar adoptantes** → Aprobar/Rechazar
4. **Gestionar proceso** → **Coordinar entrega** → Finalizar adopción

### Para Aliados Comerciales

1. **Registro como aliado** → **Verificación** → **Dashboard comercial**
2. **Registrar productos** → Gestionar inventario → **Actualizar precios**
3. **Recibir contactos** → **Procesar ventas** → Gestionar pedidos

## Configuración del Proyecto

### Requisitos del Sistema

- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer 2.x
- NPM/Yarn

### Instalación

```bash
# Clonar repositorio
git clone [url-del-repo]
cd laravel12-react

# Instalar dependencias PHP
composer install

# Instalar dependencias Node.js
npm install

# Configurar variables de entorno
cp .env.example .env
php artisan key:generate

# Migrar base de datos
php artisan migrate --seed

# Compilar assets
npm run build

# Iniciar servidores
php artisan serve
npm run dev
```

### Variables de Entorno Principales

```env
# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=adoptafacil
DB_USERNAME=root
DB_PASSWORD=

# Email
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS="noreply@adoptafacil.com"

# Pasarelas de pago
MERCADOPAGO_PUBLIC_KEY=your_key
MERCADOPAGO_ACCESS_TOKEN=your_token

# Configuración de archivos
FILESYSTEM_DISK=public
MAX_MASCOTA_IMAGES=3
MAX_PRODUCT_IMAGES=3
```

## Estructura de Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema
- **mascotas** - Mascotas para adopción
- **mascota_images** - Imágenes múltiples de mascotas
- **products** - Productos del marketplace
- **product_images** - Imágenes de productos
- **solicitudes** - Solicitudes de adopción
- **posts** - Publicaciones de la comunidad
- **comments** - Comentarios en posts
- **post_likes** - Likes en publicaciones
- **donations** - Donaciones realizadas
- **favoritos** - Favoritos de usuarios

### Relaciones Principales

```sql
-- Un usuario puede tener múltiples mascotas
users (1) → (N) mascotas

-- Una mascota puede tener múltiples imágenes
mascotas (1) → (N) mascota_images

-- Una mascota puede recibir múltiples solicitudes
mascotas (1) → (N) solicitudes

-- Un usuario puede hacer múltiples solicitudes
users (1) → (N) solicitudes

-- Un post puede tener múltiples comentarios
posts (1) → (N) comments
```

## Testing y Calidad

### Estrategia de Testing

- **Unit Tests**: Modelos y funciones individuales
- **Feature Tests**: Flujos completos de usuario
- **Integration Tests**: Comunicación entre módulos
- **Browser Tests**: Interfaz de usuario (Dusk)

### Comandos de Testing

```bash
# Ejecutar todos los tests
php artisan test

# Tests por módulo específico
php artisan test --filter=MascotaTest
php artisan test --filter=ProductTest
php artisan test --filter=SolicitudTest

# Coverage report
php artisan test --coverage
```

### Estándares de Código

- PSR-12 para PHP
- ESLint + Prettier para TypeScript/React
- PHPStan nivel 8 para análisis estático
- Conventional Commits para mensajes de git

## Deployment y Producción

### Ambientes

- **Local**: Desarrollo con Docker/Vagrant
- **Staging**: Testing con datos similares a producción
- **Production**: Servidor de producción con SSL

### CI/CD Pipeline

```yaml
# .github/workflows/
- lint.yml # Linting y formato de código
- tests.yml # Ejecución de test suite
- deploy.yml # Deployment automático
```

### Consideraciones de Producción

- **Performance**: Cache Redis, CDN para imágenes
- **Seguridad**: SSL, headers de seguridad, rate limiting
- **Monitoring**: Logs centralizados, métricas de aplicación
- **Backups**: Base de datos y archivos de usuario

## Mantenimiento y Soporte

### Comandos Artisan Personalizados

```bash
# Limpiar datos antiguos
php artisan cleanup:old-data

# Actualizar estadísticas
php artisan stats:update

# Procesar donaciones pendientes
php artisan donations:process

# Enviar notificaciones
php artisan notifications:send
```

### Logs Importantes

- `laravel.log` - Errores generales de la aplicación
- `payments.log` - Transacciones y pagos
- `security.log` - Intentos de acceso y seguridad
- `performance.log` - Métricas de rendimiento

## Contribución al Proyecto

### Workflow de Desarrollo

1. Fork del repositorio
2. Crear branch para feature: `git checkout -b feature/nueva-funcionalidad`
3. Implementar cambios con tests
4. Commit siguiendo Conventional Commits
5. Pull Request con descripción detallada

### Estructura de Commits

```
feat: agregar sistema de favoritos
fix: corregir validación de email
docs: actualizar documentación de API
test: agregar tests para módulo de solicitudes
```

## Roadmap del Proyecto

### Versión Actual (1.0.0)

- ✅ Todos los módulos principales implementados
- ✅ Sistema de autenticación completo
- ✅ Integración con pasarelas de pago
- ✅ Documentación completa

### Próximas Versiones

#### v1.1.0 (Q4 2025)

- 🔄 API REST completa para móvil
- 🔄 Sistema de notificaciones push
- 🔄 Chat en tiempo real
- 🔄 Geolocalización avanzada

#### v1.2.0 (Q1 2026)

- 🔄 Aplicación móvil nativa
- 🔄 IA para matching adopciones
- 🔄 Sistema de verificación de identidad
- 🔄 Analytics avanzados con ML

#### v2.0.0 (Q2 2026)

- 🔄 Arquitectura de microservicios
- 🔄 Multi-tenant para otros países
- 🔄 Integración con refugios oficiales
- 🔄 Plataforma de streaming de mascotas

## Contacto y Soporte

### Equipo de Desarrollo

- **Lead Developer**: [Información del lead]
- **Frontend Team**: [Información del equipo frontend]
- **Backend Team**: [Información del equipo backend]
- **QA Team**: [Información del equipo QA]

### Canales de Comunicación

- **Issues de GitHub**: Para reportar bugs
- **Discussions**: Para propuestas y discusiones
- **Wiki**: Para documentación adicional
- **Email**: [email de contacto]

---

## Licencia

Este proyecto está bajo la licencia [especificar licencia]. Ver el archivo `LICENSE` para más detalles.

## Reconocimientos

Agradecimientos especiales a todos los colaboradores, refugios de animales y organizaciones que han apoyado el desarrollo de AdoptaFácil.

---

**Última actualización**: Agosto 2025
**Versión de la documentación**: 1.0.0

---

## Navegación Rápida

| Módulo         | Archivo                                          | Descripción                  |
| -------------- | ------------------------------------------------ | ---------------------------- |
| 🐕 Mascotas    | [MODULO_MASCOTAS.md](./MODULO_MASCOTAS.md)       | Gestión completa de mascotas |
| 🛍️ Productos   | [MODULO_PRODUCTOS.md](./MODULO_PRODUCTOS.md)     | Marketplace de productos     |
| 👥 Usuarios    | [MODULO_USUARIOS.md](./MODULO_USUARIOS.md)       | Autenticación y perfiles     |
| 📋 Solicitudes | [MODULO_SOLICITUDES.md](./MODULO_SOLICITUDES.md) | Proceso de adopción          |
| 💬 Comunidad   | [MODULO_COMUNIDAD.md](./MODULO_COMUNIDAD.md)     | Red social de mascotas       |
| 📊 Dashboard   | [MODULO_DASHBOARD.md](./MODULO_DASHBOARD.md)     | Analytics y métricas         |
| 💰 Donaciones  | [MODULO_DONACIONES.md](./MODULO_DONACIONES.md)   | Pagos y donaciones           |
