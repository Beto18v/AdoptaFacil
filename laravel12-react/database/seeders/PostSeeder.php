<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

/**
 * PostSeeder - Seeder para poblar la base de datos con publicaciones de ejemplo
 *
 * Este seeder crea publicaciones de ejemplo para la sección de comunidad:
 * - Campañas de esterilización y adopción
 * - Noticias sobre la plataforma
 * - Consejos para el cuidado de mascotas
 * - Solicitudes de ayuda para mascotas
 *
 * Las publicaciones se crean solo si existen usuarios en la base de datos.
 * Cada publicación incluye contenido, categoría, likes y comentarios de ejemplo.
 */
class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear algunos posts de ejemplo si hay usuarios
        $users = User::all();

        if ($users->count() > 0) {
            // Post 1 - Campaña de esterilización
            Post::firstOrCreate(
                ['content' => '¡Gran jornada de esterilización este fin de semana! 🐾 Ayúdanos a controlar la sobrepoblación y a mejorar la calidad de vida de nuestros amigos peludos. Tendremos precios especiales y contaremos con el apoyo de veterinarios expertos. ¡No faltes!'],
                [
                    'user_id' => $users->first()->id,
                    'category' => 'Campaña',
                    'likes_count' => 125,
                    'comments_count' => 12,
                    'image_url' => 'https://images.unsplash.com/photo-1549483363-1c8b7be41523?q=80&w=870&auto=format&fit=crop',
                ]
            );

            // Post 2 - Noticia de nueva sección
            Post::firstOrCreate(
                ['content' => '¡Bienvenidos a nuestra nueva sección de Comunidad! ✨ Este es un espacio para conectar, compartir y colaborar por el bienestar de los animales. ¡Esperamos ver sus publicaciones pronto!'],
                [
                    'user_id' => $users->count() > 1 ? $users->skip(1)->first()->id : $users->first()->id,
                    'category' => 'Noticia',
                    'likes_count' => 350,
                    'comments_count' => 45,
                ]
            );

            // Post 3 - Consejo del día
            Post::firstOrCreate(
                ['content' => 'Consejo del día: ¿Sabías que el cepillado regular no solo mantiene el pelaje de tu mascota sano, sino que también fortalece su vínculo contigo? 🐕❤️'],
                [
                    'user_id' => $users->count() > 2 ? $users->skip(2)->first()->id : $users->first()->id,
                    'category' => 'Consejo',
                    'likes_count' => 88,
                    'comments_count' => 5,
                ]
            );

            // Post 4 - Búsqueda de hogar temporal
            Post::firstOrCreate(
                ['content' => '🚨 ¡URGENTE! Busco hogar temporal para gatita rescatada. Es muy tranquila, está esterilizada y al día con sus vacunas. Solo necesita amor y cuidados básicos mientras encuentra su hogar definitivo. ¿Puedes ayudarla?'],
                [
                    'user_id' => $users->first()->id,
                    'category' => 'Campaña',
                    'likes_count' => 67,
                    'comments_count' => 23,
                ]
            );

            // Post 5 - Recordatorio de seguridad
            Post::firstOrCreate(
                ['content' => 'Recordatorio importante: Nunca dejes a tu mascota en el auto bajo el sol. En días calurosos, la temperatura interior puede ser mortal en pocos minutos. ¡La seguridad de nuestros peludos es primero! ☀️🐶'],
                [
                    'user_id' => $users->count() > 1 ? $users->skip(1)->first()->id : $users->first()->id,
                    'category' => 'Consejo',
                    'likes_count' => 234,
                    'comments_count' => 8,
                ]
            );
        }
    }
}
