import { ArrowRight } from 'lucide-react';
import CategoryCard from './category-card';

interface Category {
    emoji: string;
    title: string;
    count: string;
    link: string;
}

export default function CategoriesSection({ categories }: { categories: Category[] }) {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 py-20 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-green-200 opacity-20 dark:bg-green-600"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-200 opacity-20 dark:bg-blue-600"></div>
            </div>

            <div className="relative container mx-auto px-4">
                {/* Header mejorado */}
                <div className="mb-16 text-center">
                    <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-green-100 to-blue-100 px-6 py-2 text-sm font-medium text-green-800 dark:from-green-900 dark:to-blue-900 dark:text-green-200">
                        <span className="mr-2">🐾</span>
                        Encuentra tu compañero ideal
                    </div>
                    <h2 className="mb-4 text-4xl font-bold text-gray-800 lg:text-5xl dark:text-white">
                        Explora por
                        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> categoría</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                        Descubre mascotas increíbles esperando un hogar lleno de amor
                    </p>
                </div>

                {/* Grid de categorías optimizado para 2 elementos */}
                <div className="mx-auto max-w-4xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {categories.map((category, index) => (
                            <CategoryCard key={index} {...category} />
                        ))}
                    </div>
                </div>

                {/* Call to action adicional */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center rounded-full bg-white px-6 py-3 shadow-lg transition-all hover:shadow-xl dark:bg-gray-700">
                        <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">¿No encuentras lo que buscas?</span>
                        <a
                            href="/mascotas"
                            className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Ver todas las mascotas
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
