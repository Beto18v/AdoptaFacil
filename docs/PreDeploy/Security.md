https://deepwiki.com/search/revisa-auth-permisos-sesionesj_b5a41c51-46bb-4298-949c-040eb43fb139?mode=deep

Auditoría de Seguridad - AdoptaFacil
🔴 VULNERABILIDADES CRÍTICAS

1. Restablecimiento de Contraseña Sin Autenticación (CRÍTICO)
   Vulnerabilidad: El endpoint /api/users/reset-password permite cambiar contraseñas sin verificar tokens o autenticación. api.php:32-35 UserController.php:41-71

Riesgo: Cualquiera puede cambiar la contraseña de cualquier usuario conociendo solo su email.

Fix: laravel12-react/app/Http/Controllers/Api/UserController.php

Eliminar este endpoint completamente o requerir token de validación
Usar el sistema nativo de Laravel para reset de passwords con tokens firmados
Agregar middleware auth:sanctum si debe mantenerse 21. CORS Totalmente Abierto (CRÍTICO)
   Vulnerabilidad: Los microservicios tienen CORS configurado para aceptar peticiones de cualquier origen. main.py:13-19 EstadisticasController.java:17

Riesgo: Ataques CSRF, robo de datos desde sitios maliciosos, acceso no autorizado.

Fix:

chatbot-faq-service/app/main.py: Cambiar allow_origins=["*"] por lista específica de dominios permitidos (ej: ["http://localhost:8000", "https://adoptafacil.com"])
Vulnerabilidad: Las sesiones no están encriptadas en la base de datos. session.php:50

Fix: laravel12-react/.env

SESSION_ENCRYPT=true  
4. Cookies Sin Flags de Seguridad en Producción
Vulnerabilidad: Las cookies no tienen configurados secure y pueden ser interceptadas. session.php:172 .env.example:32-34

Fix: laravel12-react/.env para producción:

SESSION_SECURE_COOKIE=true  
SESSION_SAME_SITE=strict  
🟠 VULNERABILIDADES ALTAS 5. Falta de Rate Limiting en APIs Públicas
Vulnerabilidad: Endpoints API públicos sin protección contra fuerza bruta o DoS. api.php:26-41

Riesgo: Ataques de fuerza bruta, abuso de recursos, DDoS.

Fix: laravel12-react/routes/api.php

Route::prefix('descripciones')->middleware('throttle:10,1')->group(function () {  
 Route::post('/generar', [DescripcionMascotaController::class, 'generarDescripcion']);  
 Route::get('/verificar-servicio', [DescripcionMascotaController::class, 'verificarServicio']);  
});

Route::prefix('users')->middleware('throttle:5,1')->group(function () {  
 Route::post('/validate-email', [UserController::class, 'validateEmail']);  
 Route::post('/reset-password', [UserController::class, 'resetPassword']); // O eliminar  
});

Route::get('/top-shelters', [ShelterController::class, 'topShelters'])->middleware('throttle:60,1'); 6. Rutas Administrativas Sin Middleware de Verificación
Vulnerabilidad: Verificación de rol admin solo en el controlador, no en rutas. web.php:176-180 GestionUsuariosController.php:14-19

Fix: Crear middleware EnsureUserIsAdmin y aplicar:

// app/Http/Middleware/EnsureUserIsAdmin.php  
Route::middleware(['auth', 'verified', 'admin'])->group(function () {  
 Route::get('gestion-usuarios', [GestionUsuariosController::class, 'index'])->name('gestion.usuarios');  
 // ... resto de rutas admin  
}); 7. Validación de Tipo de Archivo Insuficiente
Vulnerabilidad: Solo se valida extensión y MIME type, no contenido real del archivo. StoreMascotaRequest.php:34-36 ProductController.php:170-172

Riesgo: Subida de archivos maliciosos disfrazados como imágenes.

Fix: Agregar validación de contenido real:

// app/Http/Requests/StoreMascotaRequest.php  
'imagenes.\*' => [
 'required',
 'file',
 'mimes:jpeg,png,jpg,gif',
 'max:2048',
 function ($attribute, $value, $fail) {
if (!getimagesize($value->path())) {
 $fail('El archivo no es una imagen válida.');
 }
 },
], 8. Falta de Sanitización en Nombres de Archivo
Vulnerabilidad: Los archivos se guardan sin sanitizar nombres, posible path traversal. MascotaController.php:84-93

Fix: Agregar sanitización:

$path = $imagen->storeAs(  
 'mascotas',  
 Str::uuid() . '.' . $imagen->getClientOriginalExtension(),  
 'public'  
); 9. Hardcoded URLs de Microservicios
   Vulnerabilidad: URLs de microservicios hardcoded expuestas. GestionUsuariosController.php:88 RegisteredUserController.php:79 GoogleController.php:48

Fix: Mover a variables de entorno:

// .env  
// Usar: config('services.chatbot_service.url')
🟡 VULNERABILIDADES MEDIAS 10. Tokens JWT Sin Expiración Configurada
Vulnerabilidad: Tokens de Sanctum sin tiempo de expiración. sanctum.php:50

Fix: laravel12-react/config/sanctum.php

'expiration' => 60, // 60 minutos 11. Exposición de Información en Logs
Vulnerabilidad: Se loggean contraseñas y datos sensibles. GestionUsuariosController.php:33-37

Fix: Nunca loggear $request->all() que puede contener passwords. Filtrar datos sensibles.

12. Falta de Protección CSRF en Endpoint Público
    Vulnerabilidad: Endpoint de token CSRF sin protección. web.php:115-117

Fix: Este endpoint está bien, pero debería tener rate limiting:

Route::get('/csrf-token', function () {  
 return response()->json(['csrf_token' => csrf_token()]);  
})->middleware('throttle:60,1'); 13. Validación de Email Revela Usuarios Existentes
Vulnerabilidad: El endpoint permite enumerar usuarios registrados. UserController.php:17-36

Riesgo: Facilita ataques dirigidos y phishing.

Fix: Devolver respuesta genérica o requerir autenticación para este endpoint.

14. Falta de Protección contra Mass Assignment
    Vulnerabilidad: El modelo User tiene role en fillable sin validación adicional. User.php:21-28

Riesgo: Un atacante podría intentar escalar privilegios.

Fix: Aunque las rutas tienen validación, es mejor proteger a nivel modelo:

protected $guarded = ['id', 'role']; // En lugar de fillable  
// Y asignar role explícitamente en controladores 15. Timeouts Muy Altos en Llamadas HTTP
Vulnerabilidad: Timeout de 30 segundos puede bloquear workers. DescripcionMascotaController.php:39-42

Fix: Reducir timeout y usar jobs asíncronos:

'timeout' => 10,  
'connect_timeout' => 5, 16. Falta de Validación de Tamaño Total de Archivos
Vulnerabilidad: Se valida tamaño individual pero no total de la petición. ProductController.php:164-172

Fix: Agregar validación de tamaño total y configurar en php.ini:

upload_max_filesize = 6M # 3 imágenes x 2MB  
post_max_size = 8M  
17. Donaciones Sin Autenticación en Endpoint
Vulnerabilidad: Importación de donaciones verifica rol pero no usa middleware. DonationController.php:51-69

Fix: laravel12-react/routes/web.php

Route::post('donaciones/import', [DonationController::class, 'importDonations'])  
 ->middleware(['auth', 'verified', 'role:aliado'])  
 ->name('donaciones.import');
🔵 MEJORAS DE SEGURIDAD RECOMENDADAS 18. Implementar Content Security Policy (CSP)
Fix: Agregar middleware CSP en app/Http/Middleware/SecurityHeaders.php:

$response->headers->set('Content-Security-Policy', "default-src 'self'");  
$response->headers->set('X-Frame-Options', 'SAMEORIGIN');  
$response->headers->set('X-Content-Type-Options', 'nosniff'); Fix FastAPI: chatbot-faq-service/app/main.py

from slowapi import Limiter, \_rate_limit_exceeded_handler  
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)  
app.state.limiter = limiter
20. Auditoría de Logs
    Fix: Implementar logging de acciones sensibles:

// En controladores administrativos  
Log::channel('security')->info('Admin action', [
 'user_id' => auth()->id(),
 'action' => 'user_deleted',
 'target_id' => $user->id
]); 21. Implementar 2FA para Administradores
Fix: Instalar laravel/fortify y habilitar 2FA para usuarios admin.

22. Variables de Entorno Faltantes en .env.example
    Vulnerabilidad: Faltan variables importantes en el ejemplo. .env.example:68-70

Fix: Agregar al .env.example:

PET_DETAIL_SERVICE_URL=http://localhost:8001  
SANCTUM_TOKEN_EXPIRATION=60  
SESSION_ENCRYPT=false  
SESSION_SECURE_COOKIE=false  
📋 RESUMEN DE PRIORIDADES
CRÍTICAS (Implementar Inmediatamente):

Eliminar/Asegurar endpoint de reset password (API)
Configurar CORS restrictivo en todos los servicios
Habilitar encriptación de sesiones
Configurar cookies seguras para producción
ALTAS (Implementar Esta Semana): 5. Agregar rate limiting a APIs públicas 6. Crear middleware de admin y aplicarlo 7. Mejorar validación de archivos subidos 8. Mover URLs hardcoded a configuración

MEDIAS (Implementar Este Mes):
9-17. Mejoras de validación, protección contra mass assignment, y optimizaciones

BAJAS (Roadmap):
18-22. Mejoras adicionales de seguridad y monitoreo

Notes
Esta auditoría cubre la aplicación Laravel principal y el microservicio FastAPI para el chatbot. Las vulnerabilidades más críticas están relacionadas con autenticación, CORS y manejo de sesiones. Se recomienda implementar las correcciones en el orden de prioridad indicado y realizar testing de seguridad después de cada implementación.
