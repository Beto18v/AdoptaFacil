<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;

/**
 * ProductSeeder - Seeder para poblar la base de datos con productos de ejemplo
 *
 * Este seeder crea productos para la tienda en línea de la plataforma:
 * - Alimentos para mascotas (perros y gatos)
 * - Accesorios y juguetes
 * - Productos de higiene y cuidado
 * - Medicamentos y suplementos
 *
 * Los productos se crean asociados a usuarios con rol 'aliado'.
 * Se crean solo si no existen previamente para evitar duplicados.
 */
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener usuarios aliados para asociar los productos
        $aliados = User::where('role', 'aliado')->get();

        if ($aliados->count() > 0) {
            $productos = [
                [
                    'name' => 'Alimento Premium para Perros Adultos',
                    'description' => 'Alimento balanceado de alta calidad para perros adultos de todas las razas. Contiene proteínas de alta digestibilidad, vitaminas y minerales esenciales.',
                    'price' => 85000,
                    'stock' => 50,
                ],
                [
                    'name' => 'Alimento para Gatos Sabor Salmon',
                    'description' => 'Croquetas premium para gatos con sabor a salmón. Ideal para felinos adultos, proporciona nutrición completa y equilibrada.',
                    'price' => 65000,
                    'stock' => 30,
                ],
                [
                    'name' => 'Juguete Interactivo para Perros',
                    'description' => 'Pelota inteligente con dispensador de premios. Ayuda a mantener activo y mentalmente estimulado a tu perro.',
                    'price' => 25000,
                    'stock' => 20,
                ],
                [
                    'name' => 'Arena Sanitaria para Gatos',
                    'description' => 'Arena absorbente premium con control de olores. Ideal para mantener la higiene del hogar de tu gato.',
                    'price' => 18000,
                    'stock' => 40,
                ],
                [
                    'name' => 'Shampoo Antipulgas para Perros',
                    'description' => 'Shampoo medicinal con ingredientes naturales que repele pulgas y garrapatas. Seguro para perros de todas las edades.',
                    'price' => 35000,
                    'stock' => 25,
                ],
                [
                    'name' => 'Cama Ortodédica para Mascotas',
                    'description' => 'Cama ergonómica con espuma viscoelástica. Perfecta para mascotas con problemas articulares o para mayor comodidad.',
                    'price' => 120000,
                    'stock' => 15,
                ],
                [
                    'name' => 'Suplemento Nutricional para Mascotas',
                    'description' => 'Complejo vitamínico especialmente formulado para fortalecer el sistema inmunológico y mejorar la salud general.',
                    'price' => 45000,
                    'stock' => 35,
                ],
                [
                    'name' => 'Collar Antipulgas Electrónico',
                    'description' => 'Collar repelente de pulgas y garrapatas con tecnología ultrasónica. Efectivo por hasta 6 meses.',
                    'price' => 55000,
                    'stock' => 18,
                ],
            ];

            foreach ($productos as $producto) {
                // Asignar producto a un aliado aleatorio
                $aliado = $aliados->random();

                Product::firstOrCreate(
                    ['name' => $producto['name']],
                    array_merge($producto, [
                        'user_id' => $aliado->id,
                        'imagen' => null, // Imagen opcional
                    ])
                );
            }
        }
    }
}
