# AdoptaFácil 🐾

![Logo](https://github.com/beto18v/laravel12-react/blob/main/public/Logo/Logo.png?raw=true) ![Logo](https://github.com/beto18v/laravel12-react/blob/main/public/Logo/LogoWhite.png?raw=true)

AdoptaFácil es una plataforma web integral diseñada para facilitar la adopción de mascotas, conectar a la comunidad amante de los animales y ofrecer un espacio para que refugios, veterinarias y tiendas puedan gestionar y ofrecer sus servicios y productos.

## ✨ Características Principales

### 🔐 **Gestión de Usuarios con Roles**

- **Cliente:** Puede adoptar mascotas, comprar productos y realizar donaciones.
- **Aliado:** (Refugios, veterinarias, etc.) Puede registrar mascotas y productos para la venta.
- **Administrador:** Tiene control total sobre la plataforma (gestión de usuarios, estadísticas, etc.).

### 🐕 **Sistema de Adopciones Completo**

- **Formulario de Adopción:** Formulario detallado con validación completa
- **Gestión de Solicitudes:** Dashboard para aliados y clientes
- **Estados de Solicitudes:** Enviada, En Proceso, Aprobada, Rechazada, Cancelada
- **Comentarios de Rechazo:** Los aliados pueden agregar motivos de rechazo
- **Favoritos en Tiempo Real:** Actualización instantánea sin recarga de página

### 🛒 **Módulo de Productos y Servicios**

- Los aliados pueden registrar productos para la venta
- Catálogo interactivo con carrusel responsive
- Sistema de imágenes múltiples por producto/mascota

### 💰 **Sistema de Donaciones**

Los usuarios pueden realizar donaciones a los refugios registrados en la plataforma.

### 📊 **Panel de Control (Dashboard)**

- **Para Clientes:** Favoritos, estado de solicitudes y donaciones realizadas
- **Para Aliados:** Gestión de mascotas/productos, solicitudes y estadísticas
- **General:** Estadísticas de adopciones, notificaciones y mapa interactivo

### 💳 **Proceso de Pago Integrado**

Se utiliza MercadoPago para procesar las compras de productos.

### 🔒 **Autenticación y Seguridad**

- Registro y login de usuarios
- Verificación de correo electrónico y recuperación de contraseña
- Políticas de acceso según rol del usuario

## 🚀 Tecnologías Utilizadas

### **Backend**

- **Laravel 12** - Framework PHP moderno
- **MySQL/PostgreSQL/SQLite** - Base de datos
- **Pest** - Testing framework

### **Frontend**

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite 6** - Build tool y dev server
- **Inertia.js 2** - Integración Laravel-React
- **Tailwind CSS 4** - Framework de estilos

### **Dependencias Principales**

```json
{
    "php": "^8.2",
    "laravel/framework": "^12.0",
    "inertiajs/inertia-laravel": "^2.0",
    "mercadopago/dx-php": "^3.5",
    "react": "^19.0.0",
    "typescript": "^5.7.2",
    "tailwindcss": "^4.0.0"
}
```

### **Librerías Especializadas**

- **Chart.js + React-ChartJS-2** - Gráficos y estadísticas
- **jsPDF + jsPDF-AutoTable** - Generación de PDFs
- **Leaflet + React-Leaflet** - Mapas interactivos
- **Radix UI** - Componentes de UI accesibles
- **Lucide React** - Iconos
- **Framer Motion** - Animaciones

## 🔧 Instalación y Configuración

### **1. Clonar el repositorio**

```bash
git clone https://github.com/beto18v/laravel12-react.git
cd laravel12-react
```

### **2. Instalar dependencias**

```bash
# Dependencias de PHP
composer install

# Dependencias de Node.js
npm install
```

### **3. Configurar el entorno**

```bash
# Copiar archivo de configuración
cp .env.example .env

# Generar clave de la aplicación
php artisan key:generate

# Crear enlace simbólico para storage
php artisan storage:link
```

### **4. Configurar base de datos**

Edita el archivo `.env` con tu configuración de base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=adoptafacil
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### **5. Ejecutar migraciones y seeders**

```bash
php artisan migrate --seed
```

### **6. Iniciar el entorno de desarrollo**

```bash
# Comando único que inicia todos los servicios
composer run dev

# O manualmente:
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Compilador Vite
npm run dev

# Terminal 3: Cola de trabajos (opcional)
php artisan queue:work
```

## 🛠️ Uso

### **Acceso a la aplicación**

Una vez iniciada, accede en: `http://127.0.0.1:8000`

### **Crear cuentas**

- **Registro normal:** Como "Cliente" o "Aliado" desde la página de registro
- **Administrador:** Usar comando artisan:

```bash
php artisan app:create-admin-user "Nombre" "correo@ejemplo.com" "contraseña"
```

### **Funcionalidades principales**

1. **Adopciones:** Navega mascotas, envía solicitudes con formulario completo
2. **Productos:** Explora el catálogo de productos de aliados
3. **Favoritos:** Guarda mascotas favoritas con actualización en tiempo real
4. **Dashboard:** Gestiona solicitudes, mascotas y productos según tu rol
5. **Donaciones:** Apoya refugios registrados en la plataforma

## 🧪 Pruebas

```bash
# Ejecutar suite completa de pruebas
npm test

# Solo pruebas de Pest (PHP)
php artisan test

# Con coverage
php artisan test --coverage
```

## 📱 Características Avanzadas

### **🎨 Interfaz Responsive**

- Diseño mobile-first
- Carrusel de imágenes optimizado para móvil y desktop
- Navegación adaptativa según dispositivo

### **⚡ Rendimiento Optimizado**

- Actualización optimista de favoritos
- Carga diferida de imágenes
- Hot Module Replacement con Vite

### **🌙 Theming Avanzado**

- Modo claro/oscuro
- Temas personalizables (azul, verde)
- Persistencia de preferencias

### **📊 Analytics y Reportes**

- Estadísticas de adopciones
- Gráficos interactivos
- Exportación a PDF

## 🔄 Mejoras Recientes Implementadas

### **✅ Sistema de Solicitudes Mejorado**

- Formulario completo de adopción con todas las validaciones
- Modal de rechazo con comentarios para aliados
- Visualización de motivos de rechazo para clientes
- Interfaz con títulos verdes y feedback visual mejorado

### **✅ Favoritos en Tiempo Real**

- Actualización instantánea sin esperar respuesta del servidor
- Manejo automático de errores con reversión de estado
- Experiencia de usuario fluida

### **✅ Carrusel Responsive Corregido**

- Botones de navegación reposicionados para no interferir
- Navegación específica para móvil y desktop
- Visibilidad completa de botones de acción

### **✅ Interfaz Unificada**

- Estilos consistentes en todos los modales
- Tipografía y colores estandarizados
- Experiencia visual cohesiva

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para facilitar la adopción de mascotas y conectar a la comunidad amante de los animales.**
