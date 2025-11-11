import { Link } from '@inertiajs/react';

interface ProductCardProps {
    nombre: string;
    descripcion: string;
    precio: string;
    imageUrl: string;
}

export default function ProductCard({ nombre, descripcion, precio, imageUrl }: ProductCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            {/* Imagen con overlay */}
            <div className="relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={nombre}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                {/* Overlay sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                {/* Badge de nuevo en la esquina */}
                <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    Nuevo
                </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-8">
                {/* Nombre con gradiente */}
                <h3 className="mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
                    {nombre}
                </h3>

                {/* Descripción */}
                <p className="mb-4 line-clamp-2 leading-relaxed text-gray-600 dark:text-gray-300">{descripcion}</p>

                {/* Precio destacado */}
                <div className="mb-6">
                    <p className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-3xl font-bold text-transparent dark:from-green-400 dark:to-green-500">
                        {precio}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Precio final</p>
                </div>

                {/* Separador decorativo */}
                <div className="mb-6 h-0.5 w-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 group-hover:w-24"></div>

                {/* Botón de acción */}
                <Link
                    href="/productos"
                    className="block w-full rounded-xl bg-gradient-to-r from-green-500 to-green-700 py-4 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-300/50 focus:outline-none"
                >
                    <span className="flex items-center justify-center space-x-2">
                        <span>🛒</span>
                        <span>Ver más detalles</span>
                    </span>
                </Link>
            </div>

            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 translate-x-[-100%] -skew-x-12 transform rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:translate-x-[200%] group-hover:opacity-100"></div>
        </div>
    );
}
