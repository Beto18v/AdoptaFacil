import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import ProductCard from './product-card';

interface Product {
    nombre: string;
    descripcion: string;
    precio: string;
    imageUrl: string;
}

export default function ProductsSection({ products }: { products: Product[] }) {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 py-20 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200 to-green-200 opacity-20 dark:from-blue-600 dark:to-green-600"></div>
                <div className="absolute bottom-20 left-10 h-24 w-24 rounded-full bg-gradient-to-br from-green-200 to-blue-200 opacity-20 dark:from-green-600 dark:to-blue-600"></div>
            </div>

            <div className="relative container mx-auto px-4">
                {/* Header con diseño atractivo */}
                <div className="mb-16 text-center">
                    <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-green-100 px-8 py-3 text-sm font-semibold text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Todo para tu mascota
                        <Sparkles className="ml-2 h-4 w-4" />
                    </div>

                    <h2 className="mb-6 text-5xl font-bold text-gray-800 lg:text-6xl dark:text-white">
                        Productos y servicios
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                            de calidad premium
                        </span>
                    </h2>

                    <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                        Descubre una muestra de nuestros productos más recientes para cuidar y consentir a tu mascota.
                        <span className="font-semibold text-blue-600 dark:text-blue-400"> Calidad garantizada.</span>
                    </p>
                </div>

                {/* Beneficios destacados */}
                <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="text-center">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <span className="text-xl">🚚</span>
                        </div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Envío gratis</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">En compras +$50.000</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <span className="text-xl">✅</span>
                        </div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Calidad garantizada</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Productos verificados</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                            <span className="text-xl">💝</span>
                        </div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Precios justos</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Directo del aliado</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                            <span className="text-xl">🏆</span>
                        </div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Apoyo local</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Aliados verificados</p>
                    </div>
                </div>

                {/* Grid de productos */}
                <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, index) => (
                        <div key={index} className="group">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>

                {/* Call to action para productos */}
                <div className="text-center">
                    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
                        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                            <div className="text-left">
                                <h3 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">¿Eres un aliado comercial?</h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-300">
                                    Únete a nuestra red de aliados y ofrece tus productos y servicios a miles de familias que aman a sus mascotas.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <a
                                        href="/productos"
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                                    >
                                        Ver todos los productos
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </a>
                                    <a
                                        href="/register?role=aliado"
                                        className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-blue-500 hover:text-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
                                    >
                                        Ser aliado comercial
                                    </a>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-100 text-6xl dark:from-blue-900 dark:to-green-900">
                                    🛍️
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
