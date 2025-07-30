<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Donation;
use App\Models\Mascota;
use App\Models\Solicitud;
use App\Models\User;
use Carbon\Carbon;

class DashboardDataSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Crear algunas donaciones de prueba si no existen
        if (Donation::count() == 0) {
            Donation::create([
                'donor_name' => 'Juan Pérez',
                'donor_email' => 'juan@email.com',
                'amount' => 50000,
                'created_at' => Carbon::now()->subDays(5),
            ]);

            Donation::create([
                'donor_name' => 'María García',
                'donor_email' => 'maria@email.com',
                'amount' => 100000,
                'created_at' => Carbon::now()->subDays(10),
            ]);

            Donation::create([
                'donor_name' => 'Carlos López',
                'donor_email' => 'carlos@email.com',
                'amount' => 25000,
                'created_at' => Carbon::now()->subDays(2),
            ]);
        }

        // Crear algunas solicitudes de prueba si hay mascotas y usuarios
        if (Solicitud::count() == 0 && Mascota::count() > 0 && User::count() > 0) {
            $mascota = Mascota::first();
            $user = User::first();

            if ($mascota && $user) {
                Solicitud::create([
                    'user_id' => $user->id,
                    'mascota_id' => $mascota->id,
                    'estado' => 'aprobada',
                    'nombre_completo' => 'Ana Rodríguez',
                    'telefono' => '123456789',
                    'direccion' => 'Calle 123',
                    'experiencia_mascotas' => 'Tengo experiencia con perros',
                    'created_at' => Carbon::now()->subDays(3),
                ]);

                Solicitud::create([
                    'user_id' => $user->id,
                    'mascota_id' => $mascota->id,
                    'estado' => 'pendiente',
                    'nombre_completo' => 'Pedro Martínez',
                    'telefono' => '987654321',
                    'direccion' => 'Avenida 456',
                    'experiencia_mascotas' => 'Primera vez adoptando',
                    'created_at' => Carbon::now()->subDays(1),
                ]);
            }
        }
    }
}
