# Documentación Completa del Proyecto AdoptaFácil 📚

## Descripción General del Proyecto

AdoptaFácil es una plataforma integral de adopción de mascotas que combina funcionalidades de red social, marketplace y sistema de gestión. El proyecto está desarrollado con **Laravel 12** en el backend y **React con TypeScript** en el frontend, utilizando **Inertia.js** para crear una experiencia de aplicación de página única (SPA).

### Tecnologías Principales

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Bridge**: Inertia.js para SSR y SPA
- **Base de Datos**: MySQL/PostgreSQL
- **Autenticación**: Laravel Breeze
- **Pagos**: MercadoPago SDK
- **Mapas**: Integración con servicios de geolocalización

---

## Arquitectura del Sistema

### Estructura Modular

El proyecto está organizado en **6 módulos principales**, cada uno con responsabilidades específicas:

1. **[Módulo de Gestión de Mascotas](./MODULO_MASCOTAS.md)** 🐕🐱
2. **[Módulo de Gestión de Productos](./MODULO_PRODUCTOS.md)** 🛍️
3. **[Módulo de Gestión de Usuarios](./MODULO_USUARIOS.md)** 👥
4. **[Módulo de Solicitudes de Adopción](./MODULO_SOLICITUDES.md)** 📋
5. **[Módulo de Comunidad y Red Social](./MODULO_COMUNIDAD.md)** 💬
6. **[Módulo de Dashboard y Analytics](./MODULO_DASHBOARD.md)** 📊

### Módulos Complementarios

- **[Módulo de Donaciones y Pagos](./MODULO_DONACIONES.md)** 💰
- Sistema de Favoritos
- Sistema de Refugios
- Sistema de Mapas y Geolocalización
- Sistema de Enlaces Compartidos

---

## Flujo de Usuario Principal

### 1. Visitante No Autenticado

```
Landing Page → Catálogos Públicos → Registro → Verificación Email → Dashboard
     ↓              ↓                    ↓
 Mascotas      Productos           Comunidad
```

### 2. Usuario Adoptante

```
Dashboard → Ver Mascotas → Solicitar Adopción → Seguimiento → Adopción Exitosa
    ↓           ↓              ↓              ↓
Favoritos   Filtros      Formulario     Notificaciones
```

### 3. Aliado Comercial

```
Dashboard → Registrar Producto → Gestionar Inventario → Recibir Contactos
    ↓           ↓                    ↓
Mascotas   Múltiples Imágenes    Estadísticas
```

### 4. Refugio/Organización

```
Registro → Verificación → Recibir Donaciones → Mapa de Ubicación
    ↓           ↓              ↓
Perfil    Datos Contacto   Dashboard
```

---

## Controladores Documentados

### Controladores Principales

| Controlador             | Descripción                  | Módulo      |
| ----------------------- | ---------------------------- | ----------- |
| `MascotaController`     | Gestión completa de mascotas | Mascotas    |
| `ProductController`     | Marketplace de productos     | Productos   |
| `DashboardController`   | Analytics y métricas         | Dashboard   |
| `CommunityController`   | Red social y posts           | Comunidad   |
| `SolicitudesController` | Proceso de adopción          | Solicitudes |
| `DonacionesController`  | Sistema de donaciones        | Donaciones  |

### Controladores de Soporte

| Controlador              | Descripción                  | Función   |
| ------------------------ | ---------------------------- | --------- |
| `AuthController`         | Autenticación complementaria | Usuarios  |
| `FavoritosController`    | Sistema de favoritos         | Mascotas  |
| `ShelterController`      | Gestión de refugios          | Refugios  |
| `MapaController`         | Geolocalización              | Mapas     |
| `PagoController`         | Procesamiento de pagos       | Pagos     |
| `SharedController`       | Enlaces compartidos          | Comunidad |
| `EstadisticasController` | Estadísticas avanzadas       | Analytics |

### Controladores de Configuración

| Controlador                 | Descripción             | Ubicación   |
| --------------------------- | ----------------------- | ----------- |
| `ProfileController`         | Perfil de usuario       | Settings/   |
| `PasswordController`        | Cambio de contraseña    | Settings/   |
| `AccionSolicitudController` | Acciones de solicitudes | Solicitudes |

---

## Vistas React Documentadas

### Páginas Principales

| Vista           | Descripción            | Acceso      |
| --------------- | ---------------------- | ----------- |
| `index.tsx`     | Landing page principal | Público     |
| `mascotas.tsx`  | Catálogo de mascotas   | Público     |
| `productos.tsx` | Catálogo de productos  | Público     |
| `refugios.tsx`  | Directorio de refugios | Público     |
| `comunidad.tsx` | Red social             | Público     |
| `dashboard.tsx` | Panel de control       | Autenticado |

### Páginas de Autenticación

| Vista                   | Descripción          | Función |
| ----------------------- | -------------------- | ------- |
| `login.tsx`             | Inicio de sesión     | Auth    |
| `register.tsx`          | Registro de usuarios | Auth    |
| `registro-opciones.tsx` | Tipo de cuenta       | Auth    |
| `forgot-password.tsx`   | Recuperar contraseña | Auth    |

---

## Modelos de Base de Datos

### Modelos Principales

| Modelo      | Tabla       | Descripción                |
| ----------- | ----------- | -------------------------- |
| `User`      | users       | Usuarios del sistema       |
| `Mascota`   | mascotas    | Mascotas para adopción     |
| `Product`   | products    | Productos del marketplace  |
| `Solicitud` | solicitudes | Solicitudes de adopción    |
| `Post`      | posts       | Publicaciones de comunidad |
| `Donation`  | donations   | Donaciones realizadas      |

### Modelos de Soporte

| Modelo         | Tabla          | Descripción            |
| -------------- | -------------- | ---------------------- |
| `MascotaImage` | mascota_images | Imágenes múltiples     |
| `ProductImage` | product_images | Imágenes de productos  |
| `Favorito`     | favoritos      | Favoritos de usuarios  |
| `Shelter`      | shelters       | Refugios registrados   |
| `Comment`      | comments       | Comentarios en posts   |
| `PostLike`     | post_likes     | Likes en publicaciones |
| `SharedLink`   | shared_links   | Enlaces compartidos    |

---

## Funcionalidades Clave por Módulo

### 🐕 Gestión de Mascotas

- ✅ Registro con múltiples imágenes (hasta 3)
- ✅ Cálculo automático de edad
- ✅ Filtros por especie, edad, ubicación
- ✅ Sistema de favoritos
- ✅ Autorización por propietario

### 🛍️ Marketplace de Productos

- ✅ Catálogo público de productos
- ✅ Sistema de múltiples imágenes
- ✅ Gestión de inventario y stock
- ✅ Información de contacto de vendedores
- ✅ Dashboard unificado con mascotas

### 👥 Gestión de Usuarios

- ✅ Registro diferenciado por roles
- ✅ Verificación de email obligatoria
- ✅ Perfiles personalizables
- ✅ Sistema de roles (user, commercial_ally, admin)
- ✅ Autenticación segura con Laravel Breeze

### 📋 Solicitudes de Adopción

- ✅ Formulario completo de solicitud
- ✅ Sistema de estados (pendiente, aprobada, rechazada)
- ✅ Dashboard diferenciado por rol
- ✅ Notificaciones automáticas
- ✅ Historial de comunicación

### 💬 Red Social

- ✅ Feed de publicaciones con imágenes
- ✅ Sistema de likes y comentarios
- ✅ Tipos de contenido (historias, consejos, preguntas)
- ✅ Enlaces compartidos públicos
- ✅ Moderación de contenido

### 📊 Dashboard y Analytics

- ✅ Métricas principales de la plataforma
- ✅ Gráficos interactivos
- ✅ Comparaciones temporales
- ✅ Actividad reciente
- ✅ Estadísticas por módulo

---

## Características Técnicas Destacadas

### Seguridad

- 🔒 Validación exhaustiva en todos los formularios
- 🔒 Autorización granular con Policies
- 🔒 Sanitización de datos de entrada
- 🔒 Protección CSRF automática
- 🔒 Hasheado seguro de contraseñas

### Performance

- ⚡ Lazy loading de imágenes
- ⚡ Paginación en consultas pesadas
- ⚡ Cache de estadísticas frecuentes
- ⚡ Optimización de consultas con Eloquent
- ⚡ Compresión automática de imágenes

### UX/UI

- 🎨 Diseño responsive con Tailwind CSS
- 🎨 Tema claro/oscuro
- 🎨 Componentes reutilizables
- 🎨 Feedback visual inmediato
- 🎨 Navegación intuitiva

### Integraciones

- 🔌 MercadoPago para pagos
- 🔌 Sistema de email transaccional
- 🔌 Mapas para geolocalización
- 🔌 APIs REST para móvil (futuro)
- 🔌 Webhooks para notificaciones

---

## Estructura de Archivos del Proyecto

```
laravel12-react/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Controladores documentados
│   │   ├── Requests/        # Form Requests
│   │   └── Middleware/      # Middleware personalizado
│   ├── Models/              # Modelos Eloquent
│   ├── Policies/            # Políticas de autorización
│   └── Providers/           # Service Providers
├── database/
│   ├── migrations/          # Migraciones de BD
│   ├── seeders/            # Seeders de datos
│   └── factories/          # Factories para testing
├── resources/
│   ├── js/
│   │   ├── pages/          # Vistas React documentadas
│   │   ├── components/     # Componentes reutilizables
│   │   ├── layouts/        # Layouts de la aplicación
│   │   └── types/          # Tipos TypeScript
│   └── css/                # Estilos Tailwind
├── routes/
│   ├── web.php             # Rutas web principales
│   ├── api.php             # API REST endpoints
│   └── auth.php            # Rutas de autenticación
├── docs/                   # Documentación de módulos
│   ├── MODULO_MASCOTAS.md
│   ├── MODULO_PRODUCTOS.md
│   ├── MODULO_USUARIOS.md
│   ├── MODULO_SOLICITUDES.md
│   ├── MODULO_COMUNIDAD.md
│   ├── MODULO_DASHBOARD.md
│   └── MODULO_DONACIONES.md
└── tests/                  # Suite de testing
    ├── Feature/
    └── Unit/
```

---

## Contacto y Soporte

### Equipo de Desarrollo

- **Desarrollador Principal**: Beto18v
- **Repositorio**: [GitHub - AdoptaF-cil](https://github.com/Beto18v/AdoptaF-cil)
- **Rama Principal**: `main`

### Documentación

- **Documentación Técnica**: `/docs/` directory
- **API Documentation**: En desarrollo
- **Manual de Usuario**: Planificado

### Soporte

Para dudas técnicas, problemas o sugerencias, crear un issue en el repositorio de GitHub o contactar al equipo de desarrollo.

---

**Última actualización**: Agosto 2025  
**Versión del proyecto**: 1.0.0  
**Estado**: En desarrollo activo
