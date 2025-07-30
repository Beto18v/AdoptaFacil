import { Link } from '@inertiajs/react';
import { ArrowRight, Heart } from 'lucide-react';

interface CategoryCardProps {
    emoji: string;
    title: string;
    count: string;
    link: string;
}

export default function CategoryCard({ emoji, title, count, link }: CategoryCardProps) {
    const isPerro = title.toLowerCase() === 'perros';
    const gradientClass = isPerro ? 'from-orange-400 via-red-400 to-pink-400' : 'from-purple-400 via-blue-400 to-indigo-400';

    const bgClass = isPerro
        ? 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
        : 'from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20';

    return (
        <Link
            href={link}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
        >
            {/* Fondo con gradiente */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} opacity-50 transition-opacity group-hover:opacity-70`}></div>

            {/* Elemento decorativo */}
            <div
                className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradientClass} opacity-20 transition-all group-hover:scale-110`}
            ></div>

            {/* Contenido */}
            <div className="relative z-10">
                {/* Icono principal */}
                <div
                    className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientClass} shadow-lg transition-transform group-hover:scale-110`}
                >
                    <span className="text-4xl">{emoji}</span>
                </div>

                {/* Título y descripción */}
                <div className="mb-6">
                    <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
                    <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">{count} esperando un hogar</p>
                    </div>
                </div>

                {/* Call to action */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Explorar ahora</span>
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${gradientClass} transition-transform group-hover:translate-x-1`}
                    >
                        <ArrowRight className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Efecto hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Link>
    );
}
