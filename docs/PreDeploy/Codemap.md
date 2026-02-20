https://deepwiki.com/search/audita-el-repo-para-produccin_a795b5f3-2e2f-48e2-8e98-d6f91571a7b0?mode=deep

AdoptaFácil - Sistema Integral de Adopción de Mascotas
Mapa completo del sistema AdoptaFácil que cubre la arquitectura de microservicios, flujos de negocio principales y puntos de integración. Incluye el flujo desde la landing page [1a] hasta el dashboard analítico [7a], pasando por el sistema de autenticación [2d], gestión de mascotas [3b], proceso de adopción [4c], integración con IA [5c] y servicio de email [6b].

1
Flujo Principal - Landing Page y Catálogos
Punto de entrada principal que muestra mascotas y productos destacados, iniciando el flujo de navegación. See guide

Petición HTTP GET a ruta raíz

1a
Ruta principal de entrada
web.php:59
Route::get('/', function () {

1b
Consulta optimizada de productos
web.php:61
$productos = \App\Models\Product::with('user:id,name')

1c
Consulta de mascotas con relaciones
web.php:67
$todasLasMascotas = \App\Models\Mascota::with(['user:id,name', 'images:id,mascota_id,imagen_path'])

1d
Renderizado con Inertia.js
web.php:75
return Inertia::render('index', [
Frontend React recibe datos
Componente Index.tsx renderiza
Sección de productos
Sección de mascotas destacadas

2
Sistema de Autenticación y Middleware
Gestión de seguridad y control de acceso a través del stack de middleware de Laravel. See guide

bootstrap/app.php: Configuración principal

2a
Configuración de la aplicación
app.php:10
return Application::configure(basePath: dirname(**DIR**))
withMiddleware() deal

2b
Configuración de middleware
app.php:17
->withMiddleware(function (Middleware $middleware) {
Trust proxies config
Encrypt cookies
web() middleware stack

2c
Middleware web específico
app.php:23
$middleware->web(append: [HandleInertiaRequests::class,
HandleAppearance
HandleInertiaRequests
AddLinkHeadersForAssets
withExceptions() setup
withRouting() deal
web: routes/web.php
api: routes/api.php
commands: routes/console.php
create() final
Sistema de Rutas Protegidas
routes/web.php: Definición de rutas
Rutas públicas (landing, catálogos)
Rutas protegidas

2d
Protección de rutas
web.php:159
Route::middleware(['auth', 'verified'])->group(function () {
Dashboard principal
Gestión de contenido
Sistema de favoritos
Módulos autenticados
Middleware Pipeline
TrustProxies
EncryptCookies
HandleInertiaRequests
Auth + Verified gates

3
Gestión de Mascotas - CRUD Completo
Flujo completo de gestión de mascotas desde registro hasta adopción. See guide

Definición de rutas web

3a
Rutas de gestión de mascotas
web.php:292
Route::prefix('mascotas')->name('mascotas.')->group(function () {

3b
Registro de nuevas mascotas
web.php:294
Route::post('/store', [MascotaController::class, 'store'])->name('store');
GET /{mascota} - Ver detalles
PUT /{mascota} - Actualizar
DELETE /{mascota} - Eliminar
Capa de Controladores

3d
Controlador de lógica de negocio
MascotaController.php:46
class MascotaController extends Controller
index() - Listar mascotas
store() - Guardar nueva mascota
show() - Mostrar detalles
update() - Actualizar datos
destroy() - Eliminar mascota
Capa de Modelos

3c
Modelo de datos Mascota
Mascota.php:29
class Mascota extends Model
Relación con User (propietario)
Relación con Images (múltiples)
Cálculo automático de edad
Validaciones de datos

4
Proceso de Adopción - Sistema de Solicitudes
Flujo completo del proceso de adopción desde solicitud hasta aprobación. See guide

Definición de Rutas de Adopción

4a
Rutas del sistema de adopción
web.php:246
Route::prefix('solicitudes')->name('solicitudes.')->group(function () {
Creación de Solicitud de Adopción
Usuario completa formulario
Validación de datos del solicitante

4b
Creación de solicitudes
web.php:250
Route::post('/', [SolicitudesController::class, 'store'])->name('adopcion.store');
Gestión de Estados de Solicitud
Dueño de mascota recibe notificación
Revisa información del solicitante

4c
Actualización de estados
web.php:252
Route::post('/{id}/estado', [SolicitudesController::class, 'updateEstado'])->name('updateEstado');
Estructura de Base de Datos
Tabla solicitudes con relaciones

4d
Estructura de base de datos
2025_07_01_000001_create_solicitudes_table.php:15
$table->foreignId('user_id')->constrained()->onDelete('cascade');
FK a mascota_id (cascade delete)
Campos de información personal y vivienda
Flujo Completo del Proceso
Solicitud creada (estado: pendiente)
Dueño evalúa solicitud
Estado actualizado a aprobada/rechazada
Notificaciones automáticas enviadas

5
Microservicio de IA - Generación de Descripciones
Integración con servicio externo de IA para generar descripciones emotivas de mascotas. See guide

5a
Aplicación FastAPI principal
main.py:6
app = FastAPI(title="Chatbot FAQ Service")
Configuración CORS global
Permite peticiones desde Laravel

5b
Registro de rutas del chatbot
main.py:22
app.include_router(chat.router)
Prefijo "/chat" con etiquetas
Flujo de procesamiento de chat

5c
Endpoint principal del chatbot
chat.py:45
@router.post("/", response_model=ChatResponse)
Recibe ChatRequest
get_chatbot_response(message)
Búsqueda fuzzy matching
Búsqueda por keywords
Respuestas predefinidas
Retorna ChatResponse
Integración con Laravel API

5d
Integración con Laravel
api.php:27
Route::post('/descripciones/generar', [DescripcionMascotaController::class, 'generarDescripcion']);
Laravel consume servicio FastAPI
Genera descripciones con IA Groq

6
Servicio de Email - Spring Boot Microservicio
Microservicio dedicado para envío de emails transaccionales y notificaciones. See guide

Configuración de beans

6d
Cliente HTTP para integración
DemoApplication.java:17
@Bean public RestTemplate restTemplate()
Inicio del servidor con @EnableAsync
Controladores de Email

6b
Endpoint de bienvenida
WelcomeEmailController.java:28
@PostMapping("/send-welcome-email")

6b
Endpoint de bienvenida
WelcomeEmailController.java:28
@PostMapping("/send-welcome-email")
Otros controladores (notificación,

6c
Dependencia de email
pom.xml:26
<artifactId>spring-boot-starter-mail</artifactId>

7
Dashboard Analítico - Métricas y Estadísticas
Sistema consolidado de análisis que extrae métricas de todos los módulos. See guide

7a
Ruta principal del dashboard
web.php:171
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
DashboardController@index()
Cálculo de métricas base

7b
Cálculo de métricas principales
DashboardController.php:19
$totalMascotas = Mascota::count();
totalAdopciones = Solicitud::where('estado', 'aprobada')->count()
totalDonaciones = Donation::sum('amount') ?? 0
totalUsuarios = User::count()
Análisis de tendencias temporales
Obtener datos mes anterior

7c
Cálculo de tendencias
DashboardController.php:33
$cambioMascotas = $mascotasAnterior > 0 ? round((($totalMascotas - $mascotasAnterior) / $mascotasAnterior) \* 100, 1) : 100;
Generación de datos para gráficos

7d
Análisis de distribución
DashboardController.php:43
$distribucionTipos = Mascota::selectRaw('especie, COUNT(\*) as total')
Renderizado con Inertia.js
