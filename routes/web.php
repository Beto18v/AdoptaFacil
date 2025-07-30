<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\SolicitudesController;
use App\Http\Controllers\SharedController;


Route::get('/', function () {
    // Obtener los últimos 3 productos para mostrar en el landing
    $productos = \App\Models\Product::with('user')->latest()->take(3)->get()->map(function ($producto) {
        return (object) [
            'id' => $producto->id,
            'nombre' => $producto->nombre,        // Usar accessor
            'descripcion' => $producto->descripcion, // Usar accessor
            'precio' => $producto->precio,        // Usar accessor
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
        'todasLasMascotas' => $todasLasMascotas // Enviar todas para calcular conteos
    ]);
})->name('index');

Route::get('/mascotas', [MascotaController::class, 'indexPublic'])->name('mascotas');

Route::get('/productos', [ProductController::class, 'indexPublic'])->name('productos');

Route::get('/refugios', [ShelterController::class, 'index'])->name('refugios');
Route::post('/shelters', [ShelterController::class, 'store'])->middleware(['auth', 'verified'])->name('shelter.store');

// Community routes
Route::get('/comunidad', [App\Http\Controllers\CommunityController::class, 'index'])->name('comunidad');
Route::post('/comunidad/posts', [App\Http\Controllers\CommunityController::class, 'store'])->middleware(['auth'])->name('posts.store');
Route::post('/comunidad/posts/{post}/like', [App\Http\Controllers\CommunityController::class, 'toggleLike'])->middleware(['auth'])->name('posts.like');
Route::post('/comunidad/posts/{post}/comments', [App\Http\Controllers\CommunityController::class, 'storeComment'])->middleware(['auth'])->name('posts.comments.store');
Route::get('/comunidad/posts/{post}/comments', [App\Http\Controllers\CommunityController::class, 'getComments'])->name('posts.comments.get');
Route::delete('/comunidad/posts/{post}', [App\Http\Controllers\CommunityController::class, 'destroy'])->middleware(['auth'])->name('posts.destroy');

// Shared links routes
Route::post('/comunidad/posts/{post}/share', [App\Http\Controllers\SharedController::class, 'create'])->middleware(['auth'])->name('posts.share');
Route::get('/shared/{token}', [App\Http\Controllers\SharedController::class, 'show'])->name('shared.show');

Route::get('/registro-opciones', function () {
    return Inertia::render('auth/registro-opciones');
})->name('register.options');

// Ruta pública para obtener IDs de favoritos (maneja autenticación internamente)
Route::get('favoritos/ids', [App\Http\Controllers\FavoritosController::class, 'getFavoriteIds'])->name('favoritos.ids');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('favoritos', [App\Http\Controllers\FavoritosController::class, 'index'])->name('favoritos.index');
    Route::post('favoritos', [App\Http\Controllers\FavoritosController::class, 'store'])->name('favoritos.store');
    Route::delete('favoritos', [App\Http\Controllers\FavoritosController::class, 'destroy'])->name('favoritos.destroy');
    Route::post('favoritos/check', [App\Http\Controllers\FavoritosController::class, 'check'])->name('favoritos.check');
    Route::get('donaciones', [App\Http\Controllers\DonacionesController::class, 'index'])->name('donaciones.index');
    Route::post('donaciones', [App\Http\Controllers\DonacionesController::class, 'store'])->name('donaciones.store');
    Route::get('mapa', [App\Http\Controllers\MapaController::class, 'index'])->name('mapa.index');
    Route::get('estadisticas', [App\Http\Controllers\EstadisticasController::class, 'index'])->name('estadisticas.index');


    Route::get('solicitudes', [App\Http\Controllers\SolicitudesController::class, 'index'])->name('solicitudes.index');
    Route::post('solicitudes', [App\Http\Controllers\SolicitudesController::class, 'store'])->name('solicitudes.adopcion.store');
    Route::delete('solicitudes/{solicitud}', [App\Http\Controllers\SolicitudesController::class, 'destroy'])->name('solicitudes.destroy');
    Route::get('solicitudes/{id}', [App\Http\Controllers\SolicitudesController::class, 'show'])->name('solicitudes.show');
    Route::post('solicitudes/{id}/estado', [App\Http\Controllers\SolicitudesController::class, 'updateEstado'])->name('solicitudes.updateEstado');
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
    Route::delete('/mascotas/{mascota}', [App\Http\Controllers\MascotaController::class, 'destroy'])->name('mascotas.destroy');


    // Route::get('/mascotas', [MascotaController::class, 'index'])->name('mascotas.index');
    Route::post('/acciones-solicitud/store', [\App\Http\Controllers\AccionSolicitudController::class, 'store'])->name('acciones-solicitud.store');
    Route::post('/pagos/iniciar', [PagoController::class, 'iniciarPago']);
    Route::post('/pagos/webhook', [PagoController::class, 'webhook']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
