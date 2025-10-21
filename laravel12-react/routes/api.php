<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DescripcionMascotaController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas para el servicio de descripciones de mascotas
Route::prefix('descripciones')->group(function () {
    Route::post('/generar', [DescripcionMascotaController::class, 'generarDescripcion']);
    Route::get('/verificar-servicio', [DescripcionMascotaController::class, 'verificarServicio']);
});

// Rutas para gestión de usuarios (para integración con Spring Boot)
Route::prefix('users')->group(function () {
    Route::post('/validate-email', [UserController::class, 'validateEmail']);
    Route::post('/reset-password', [UserController::class, 'resetPassword']);
});

/*
Endpoints disponibles:
- POST /api/descripciones/generar
- GET /api/descripciones/verificar-servicio
- POST /api/users/validate-email
- POST /api/users/reset-password
*/
