// resources/js/Pages/Shared/PostShow.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

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
    comments: number;
    category: string;
}

interface SharedLink {
    id: number;
    token: string;
    expires_at: string;
}

interface Props {
    post: Post;
    sharedLink: SharedLink;
}

export default function PostShow({ post, sharedLink }: Props) {
    const getCategoryClass = (category: string) => {
        switch (category) {
            case 'Campaña':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Noticia':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Consejo':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <>
            <Head title={`Publicación compartida - ${post.author.name}`} />

            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-2xl px-4">
                    {/* Header con enlace a la comunidad */}
                    <div className="mb-6">
                        <a
                            href="/comunidad"
                            className="inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Ver más publicaciones en la comunidad
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Publicación compartida */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
                        {/* Banner de publicación compartida */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
                            <p className="text-sm font-medium text-white">📤 Publicación compartida de la comunidad AdoptaFácil</p>
                        </div>

                        {/* Cabecera de la publicación */}
                        <div className="flex items-center p-6">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                                <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 flex-1">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{post.author.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getCategoryClass(post.category)}`}>{post.category}</span>
                        </div>

                        {/* Contenido de la publicación */}
                        <div className="px-6 pb-6">
                            {post.imageUrl ? (
                                <div className="space-y-4">
                                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{post.content}</p>
                                    <div className="overflow-hidden rounded-lg">
                                        <img src={post.imageUrl} alt="Imagen del post" className="h-auto max-h-96 w-full object-cover" />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{post.content}</p>
                            )}
                        </div>

                        {/* Estadísticas */}
                        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">❤️ {post.likes} Me gusta</span>
                                <span className="flex items-center gap-1">💬 {post.comments} Comentarios</span>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700/50">
                            <div className="text-center">
                                <p className="mb-3 text-gray-600 dark:text-gray-300">
                                    ¿Te gusta esta publicación? Únete a nuestra comunidad para ver más contenido como este.
                                </p>
                                <a
                                    href="/comunidad"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Explorar Comunidad
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>
                            Este enlace expira el{' '}
                            {new Date(sharedLink.expires_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
