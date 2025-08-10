<?php

// Agregar estas rutas al archivo routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DescripcionMascotaController;

// Rutas para el servicio de descripciones de mascotas
Route::prefix('descripciones')->group(function () {
    Route::post('/generar', [DescripcionMascotaController::class, 'generarDescripcion']);
    Route::get('/verificar-servicio', [DescripcionMascotaController::class, 'verificarServicio']);
});

/*
Endpoints disponibles:
- POST /api/descripciones/generar
- GET /api/descripciones/verificar-servicio
*/
