<?php

namespace Database\Seeders;

use App\Models\Shelter;
use App\Models\User;
use App\Models\Mascota;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ShelterSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuarios aliados para los refugios
        $ciudades = [
            'Bogotá' => 3,
            'Medellín' => 2,
            'Cali' => 2,
            'Barranquilla' => 1,
            'Cartagena' => 1,
            'Bucaramanga' => 1,
        ];

        foreach ($ciudades as $ciudad => $cantidadRefugios) {
            for ($i = 1; $i <= $cantidadRefugios; $i++) {
                // Crear usuario aliado
                $user = User::create([
                    'name' => "Refugio {$ciudad} {$i}",
                    'email' => strtolower("refugio{$ciudad}{$i}@example.com"),
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'aliado',
                ]);

                // Crear refugio
                $shelter = Shelter::create([
                    'name' => "Refugio de Mascotas {$ciudad} {$i}",
                    'user_id' => $user->id,
                    'description' => "Refugio dedicado al cuidado y adopción de mascotas en {$ciudad}",
                    'address' => "Calle {$i} #{$i}-{$i}, {$ciudad}",
                    'city' => $ciudad,
                    'phone' => '300' . rand(1000000, 9999999),
                    'bank_name' => 'Bancolombia',
                    'account_type' => 'Ahorros',
                    'account_number' => rand(10000000, 99999999),
                ]);

                // Crear mascotas para cada refugio
                $especies = ['Perro', 'Gato', 'Conejo', 'Ave'];
                $razas = [
                    'Perro' => ['Labrador', 'Golden Retriever', 'Bulldog', 'Pastor Alemán', 'Mestizo'],
                    'Gato' => ['Siamés', 'Persa', 'Maine Coon', 'Angora', 'Mestizo'],
                    'Conejo' => ['Holandés', 'Angora', 'Rex', 'Mestizo'],
                    'Ave' => ['Canario', 'Periquito', 'Cacatúa', 'Loro'],
                ];

                $cantidadMascotas = rand(5, 15);
                for ($j = 1; $j <= $cantidadMascotas; $j++) {
                    $especie = $especies[array_rand($especies)];
                    $raza = $razas[$especie][array_rand($razas[$especie])];
                    
                    Mascota::create([
                        'nombre' => $this->generarNombreMascota(),
                        'especie' => $especie,
                        'raza' => $raza,
                        'edad' => rand(1, 10),
                        'descripcion' => "Hermosa mascota en busca de un hogar lleno de amor en {$ciudad}",
                        'imagen' => null,
                        'user_id' => $user->id,
                    ]);
                }
            }
        }
    }

    private function generarNombreMascota(): string
    {
        $nombres = [
            'Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Lucy', 'Rocky', 'Daisy',
            'Buddy', 'Molly', 'Jack', 'Sadie', 'Oliver', 'Maggie', 'Bear', 'Sophie',
            'Zeus', 'Chloe', 'Duke', 'Zoe', 'Toby', 'Lily', 'Tucker', 'Penny',
            'Simba', 'Mia', 'Leo', 'Nala', 'Milo', 'Coco', 'Oreo', 'Princess',
            'Shadow', 'Ruby', 'Gizmo', 'Rosie', 'Bandit', 'Lola', 'Rusty', 'Emma'
        ];

        return $nombres[array_rand($nombres)];
    }
}