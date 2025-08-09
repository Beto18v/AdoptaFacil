<?php

/**
 * Archivo de rutas principales de AdoptaFácil
 * 
 * Este archivo define todas las rutas web de la aplicación:
 * - Rutas públicas (landing, mascotas, productos, refugios)
 * - Rutas de comunidad y funciones sociales
 * - Rutas protegidas para usuarios autenticados
 * - Integración con sistema de autenticación y configuración
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 */

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\SolicitudesController;
use App\Http\Controllers\SharedController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\FavoritosController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonacionesController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\EstadisticasController;

// ===== RUTAS PÚBLICAS =====

/**
 * Página principal (Landing)
 * Muestra productos y mascotas destacados para visitantes
 */
Route::get('/', function () {
    // Obtener los últimos 3 productos para mostrar en el landing
    $productos = \App\Models\Product::with('user')->latest()->take(3)->get()->map(function ($producto) {
        return (object) [
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'descripcion' => $producto->descripcion,
            'precio' => $producto->precio,
            'imagen' => $producto->imagen,
            'user' => $producto->user,
        ];
    });

    // Obtener TODAS las mascotas para calcular conteos correctos de categorías
    $todasLasMascotas = \App\Models\Mascota::with(['user', 'images'])->latest()->get();

    // Obtener solo las últimas 3 mascotas para mostrar en la sección de mascotas
    $mascotasParaMostrar = $todasLasMascotas->take(3);

    return Inertia::render('index', [
        'productos' => $productos,
        'mascotas' => $mascotasParaMostrar,
        'todasLasMascotas' => $todasLasMascotas
    ]);
})->name('index');

// Catálogo público de mascotas
Route::get('/mascotas', [MascotaController::class, 'indexPublic'])->name('mascotas');

// Catálogo público de productos 
Route::get('/productos', [ProductController::class, 'indexPublic'])->name('productos');

// Directorio de refugios
Route::get('/refugios', [ShelterController::class, 'index'])->name('refugios');
Route::post('/shelters', [ShelterController::class, 'store'])->middleware(['auth', 'verified'])->name('shelter.store');

// ===== RUTAS DE COMUNIDAD =====

Route::get('/comunidad', [CommunityController::class, 'index'])->name('comunidad');
Route::post('/comunidad/posts', [CommunityController::class, 'store'])->middleware(['auth'])->name('posts.store');
Route::post('/comunidad/posts/{post}/like', [CommunityController::class, 'toggleLike'])->middleware(['auth'])->name('posts.like');
Route::post('/comunidad/posts/{post}/comments', [CommunityController::class, 'storeComment'])->middleware(['auth'])->name('posts.comments.store');
Route::get('/comunidad/posts/{post}/comments', [CommunityController::class, 'getComments'])->name('posts.comments.get');
Route::delete('/comunidad/posts/{post}', [CommunityController::class, 'destroy'])->middleware(['auth'])->name('posts.destroy');

// ===== RUTAS DE COMPARTIR =====

Route::post('/comunidad/posts/{post}/share', [SharedController::class, 'create'])->middleware(['auth'])->name('posts.share');
Route::get('/shared/{token}', [SharedController::class, 'show'])->name('shared.show');

// ===== RUTAS DE AUTENTICACIÓN ESPECIALES =====

Route::get('/registro-opciones', function () {
    return Inertia::render('auth/registro-opciones');
})->name('register.options');

// Ruta pública para obtener IDs de favoritos
Route::get('favoritos/ids', [FavoritosController::class, 'getFavoriteIds'])->name('favoritos.ids');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('favoritos', [FavoritosController::class, 'index'])->name('favoritos.index');
    Route::post('favoritos', [FavoritosController::class, 'store'])->name('favoritos.store');
    Route::delete('favoritos', [FavoritosController::class, 'destroy'])->name('favoritos.destroy');
    Route::post('favoritos/check', [FavoritosController::class, 'check'])->name('favoritos.check');
    Route::get('donaciones', [DonacionesController::class, 'index'])->name('donaciones.index');
    Route::post('donaciones', [DonacionesController::class, 'store'])->name('donaciones.store');
    Route::get('mapa', [MapaController::class, 'index'])->name('mapa.index');
    Route::get('estadisticas', [EstadisticasController::class, 'index'])->name('estadisticas.index');


    Route::get('solicitudes', [SolicitudesController::class, 'index'])->name('solicitudes.index');
    Route::post('solicitudes', [SolicitudesController::class, 'store'])->name('solicitudes.adopcion.store');
    Route::delete('solicitudes/{solicitud}', [SolicitudesController::class, 'destroy'])->name('solicitudes.destroy');
    Route::get('solicitudes/{id}', [SolicitudesController::class, 'show'])->name('solicitudes.show');
    Route::post('solicitudes/{id}/estado', [SolicitudesController::class, 'updateEstado'])->name('solicitudes.updateEstado');
    Route::post('set-intended-url', [App\Http\Controllers\Auth\SetIntendedUrlController::class, 'store'])->name('set-intended-url');

    Route::get('/productos-mascotas', [ProductController::class, 'index'])->name('productos.mascotas');
    Route::post('/productos/store', [ProductController::class, 'store'])->name('productos.store');
    Route::get('/productos/{product}', [ProductController::class, 'show'])->name('productos.show');
    Route::put('/productos/{product}', [ProductController::class, 'update'])->name('productos.update');
    Route::post('/productos/{product}', [ProductController::class, 'update'])->name('productos.update.post'); // Workaround para FormData
    Route::delete('/productos/{product}', [ProductController::class, 'destroy'])->name('productos.destroy');

    Route::post('/mascotas/store', [MascotaController::class, 'store'])->name('mascotas.store');
    Route::get('/mascotas/{mascota}', [MascotaController::class, 'show'])->name('mascotas.show');
    Route::put('/mascotas/{mascota}', [MascotaController::class, 'update'])->name('mascotas.update');
    Route::post('/mascotas/{mascota}', [MascotaController::class, 'update'])->name('mascotas.update.post'); // Workaround para FormData
    Route::delete('/mascotas/{mascota}', [MascotaController::class, 'destroy'])->name('mascotas.destroy');


    // Route::get('/mascotas', [MascotaController::class, 'index'])->name('mascotas.index');
    Route::post('/acciones-solicitud/store', [\App\Http\Controllers\AccionSolicitudController::class, 'store'])->name('acciones-solicitud.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
