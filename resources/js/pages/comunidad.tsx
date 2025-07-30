import ComunityHero from '@/components/comunidad/comunity-hero';
import CreatePost from '@/components/comunidad/create-post';
import PostCard from '@/components/comunidad/post-card';
import PostFilters from '@/components/comunidad/post-filters';
import TrendingTopics from '@/components/comunidad/trending-topics';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface Post {
    id: number;
    author: {
        name: string;
        avatarUrl: string;
    };
    timestamp: string;
    content: string;
    imageUrl?: string;
    likes: number;
    is_liked?: boolean;
    comments: number;
    category: string;
}

interface ComunidadProps {
    auth?: {
        user?: User;
    };
    posts?: Post[];
    flash?: {
        success?: string;
        error?: string;
    };
}

// Datos de ejemplo para las publicaciones (como fallback)
const samplePosts = [
    {
        id: 1,
        author: {
            name: 'Fundación Huellitas Felices',
            avatarUrl: 'https://i.pravatar.cc/150?u=huellitasfelices',
        },
        timestamp: 'hace 2 horas',
        content:
            '¡Gran jornada de esterilización este fin de semana! 🐾 Ayúdanos a controlar la sobrepoblación y a mejorar la calidad de vida de nuestros amigos peludos. Tendremos precios especiales y contaremos con el apoyo de veterinarios expertos. ¡No faltes!',
        imageUrl: 'https://images.unsplash.com/photo-1549483363-1c8b7be41523?q=80&w=870&auto=format&fit=crop',
        likes: 125,
        comments: 12,
        category: 'Campaña',
    },
    {
        id: 2,
        author: {
            name: 'AdoptaFácil Admin',
            avatarUrl: 'https://i.pravatar.cc/150?u=adoptafaciladmin',
        },
        timestamp: 'hace 1 día',
        content:
            '¡Bienvenidos a nuestra nueva sección de Comunidad! ✨ Este es un espacio para conectar, compartir y colaborar por el bienestar de los animales. ¡Esperamos ver sus publicaciones pronto!',
        likes: 350,
        comments: 45,
        category: 'Noticia',
    },
    {
        id: 3,
        author: {
            name: 'Veterinaria El Arca',
            avatarUrl: 'https://i.pravatar.cc/150?u=elarca',
        },
        timestamp: 'hace 3 días',
        content:
            'Consejo del día: ¿Sabías que el cepillado regular no solo mantiene el pelaje de tu mascota sano, sino que también fortalece su vínculo contigo? 🐕❤️',
        likes: 88,
        comments: 5,
        category: 'Consejo',
    },
];

export default function Comunidad({ auth, posts: initialPosts, flash }: ComunidadProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts || samplePosts);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts || samplePosts);
    const [showFlash, setShowFlash] = useState(true);
    const user = auth?.user;

    const handlePostDelete = (postId: number) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setFilteredPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    // Función para recargar posts desde el servidor
    const handlePostCreated = () => {
        router.reload({ only: ['posts'] });
    };

    // Función para manejar actualizaciones de likes
    const handleLikeUpdate = (postId: number, liked: boolean, likesCount: number) => {
        setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: likesCount, is_liked: liked } : post)));
        setFilteredPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: likesCount, is_liked: liked } : post)));
    };

    // Función para manejar actualizaciones de comentarios
    const handleCommentUpdate = (postId: number, commentsCount: number) => {
        setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, comments: commentsCount } : post)));
        setFilteredPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, comments: commentsCount } : post)));
    };

    // Función para manejar cambios en los filtros
    const handleFiltersChange = (filters: { search: string; categories: string[] }) => {
        let filtered = [...posts];

        // Filtrar por búsqueda
        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (post) => post.content.toLowerCase().includes(searchTerm) || post.author.name.toLowerCase().includes(searchTerm),
            );
        }

        // Filtrar por categorías
        if (filters.categories.length > 0) {
            filtered = filtered.filter((post) => filters.categories.includes(post.category));
        }

        setFilteredPosts(filtered);
    };

    // Actualizar posts filtrados cuando cambien los posts originales
    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    // Ocultar mensaje flash después de 5 segundos
    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
            <Head title="Comunidad" />
            <Header />
            <ComunityHero />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Filtros a la izquierda (3 de 12 columnas) */}
                        <aside className="lg:col-span-3">
                            <PostFilters onFiltersChange={handleFiltersChange} />
                        </aside>

                        {/* Feed de publicaciones (6 de 12 columnas, el área central) */}
                        <section className="space-y-8 lg:col-span-6">
                            {/* Mensajes Flash */}
                            {showFlash && flash?.success && (
                                <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-200">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>{flash.success}</AlertDescription>
                                </Alert>
                            )}

                            {showFlash && flash?.error && (
                                <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-200">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>{flash.error}</AlertDescription>
                                </Alert>
                            )}

                            <CreatePost user={user} onPostCreated={handlePostCreated} />

                            <div className="space-y-6">
                                {filteredPosts && filteredPosts.length > 0 ? (
                                    filteredPosts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            user={user}
                                            onDelete={handlePostDelete}
                                            onLikeUpdate={handleLikeUpdate}
                                            onCommentUpdate={handleCommentUpdate}
                                        />
                                    ))
                                ) : posts && posts.length > 0 ? (
                                    <div className="rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-900">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No se encontraron publicaciones que coincidan con los filtros aplicados.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-900">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No hay publicaciones aún. ¡Sé el primero en compartir algo!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Tendencias a la derecha (3 de 12 columnas) */}
                        <aside className="hidden lg:col-span-3 lg:block">
                            <TrendingTopics />
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
            <ThemeSwitcher />
        </div>
    );
}
