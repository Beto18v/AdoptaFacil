<?php

echo "Verificando productos en la base de datos...\n";

// Bootstrap Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->boot();

try {
    $productos = \Illuminate\Support\Facades\DB::table('products')->get();

    echo "Total productos: " . $productos->count() . "\n";

    foreach ($productos as $producto) {
        echo "=== Producto ID: {$producto->id} ===\n";
        echo "Nombre: {$producto->name}\n";
        echo "Precio: {$producto->price}\n";
        echo "Descripción: {$producto->description}\n";
        echo "Imagen: {$producto->imagen}\n";
        echo "---\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
