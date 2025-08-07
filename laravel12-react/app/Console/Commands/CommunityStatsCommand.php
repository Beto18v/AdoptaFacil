<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use App\Models\User;

class CommunityStatsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'community:stats {--detailed : Show detailed statistics}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Display community statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('📊 Estadísticas de la Comunidad AdoptaFácil');
        $this->line('');

        // Estadísticas básicas
        $totalPosts = Post::count();
        $activePosts = Post::active()->count();
        $totalUsers = User::count();
        $usersWithPosts = User::has('posts')->count();

        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Total de publicaciones', $totalPosts],
                ['Publicaciones activas', $activePosts],
                ['Total de usuarios', $totalUsers],
                ['Usuarios con publicaciones', $usersWithPosts],
            ]
        );

        if ($this->option('detailed')) {
            $this->line('');
            $this->info('📈 Estadísticas Detalladas');

            // Posts por categoría
            $postsByCategory = Post::selectRaw('category, COUNT(*) as total')
                ->groupBy('category')
                ->orderBy('total', 'desc')
                ->get();

            $this->line('');
            $this->comment('Publicaciones por Categoría:');
            foreach ($postsByCategory as $category) {
                $this->line("  • {$category->category}: {$category->total}");
            }

            // Usuarios más activos
            $activeUsers = User::withCount('posts')
                ->having('posts_count', '>', 0)
                ->orderBy('posts_count', 'desc')
                ->limit(5)
                ->get();

            $this->line('');
            $this->comment('Top 5 Usuarios Más Activos:');
            foreach ($activeUsers as $user) {
                $this->line("  • {$user->name}: {$user->posts_count} publicaciones");
            }

            // Posts con más likes
            $popularPosts = Post::orderBy('likes_count', 'desc')
                ->limit(3)
                ->get();

            $this->line('');
            $this->comment('Posts Más Populares:');
            foreach ($popularPosts as $post) {
                $content = strlen($post->content) > 50
                    ? substr($post->content, 0, 50) . '...'
                    : $post->content;
                $this->line("  • \"{$content}\" - {$post->likes_count} likes");
            }
        }

        $this->line('');
        $this->info('✅ Estadísticas generadas exitosamente');
    }
}
