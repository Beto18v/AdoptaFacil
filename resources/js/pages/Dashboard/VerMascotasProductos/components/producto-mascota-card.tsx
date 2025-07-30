// Tarjeta unificada para mostrar productos y mascotas con acciones específicas por rol
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Heart, Pencil, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import FormularioAdopcion from './formulario-adopcion';

// Tipo para items de producto/mascota
export type CardItem = {
    id: number;
    nombre: string;
    tipo: 'producto' | 'mascota';
    descripcion: string;
    precio: number | null;
    imagen?: string;
    user_id: number;
    user?: { name: string };
};

// Props del componente tarjeta
interface ProductoMascotaCardProps {
    item: CardItem;
    onDelete: (item: CardItem) => void;
    onEdit: (item: CardItem) => void;
    onAction: (item: CardItem) => void;
    autoOpenAdopcion?: boolean;
    onAutoOpenHandled?: () => void;
}

export default function ProductoMascotaCard({ item, onDelete, onEdit, onAction, autoOpenAdopcion, onAutoOpenHandled }: ProductoMascotaCardProps) {
    // Obtenemos el usuario autenticado para determinar el rol
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Control del modal de adopción
    const [showAdoptionModal, setShowAdoptionModal] = useState(false);

    // Abrir automáticamente el modal si autoOpenAdopcion es true
    useEffect(() => {
        if (autoOpenAdopcion) {
            setShowAdoptionModal(true);
            if (onAutoOpenHandled) onAutoOpenHandled();
        }
    }, [autoOpenAdopcion, onAutoOpenHandled]);

    // Determinación de roles y permisos
    const esPropietario = user.role === 'aliado' && user.id === item.user_id;
    const esAdmin = user.role === 'admin';

    // El cliente ve los botones de acción principales
    const esCliente = !esPropietario && !esAdmin;

    // Manejador de acción diferenciado por tipo
    const handleActionClick = () => {
        if (item.tipo === 'mascota') {
            setShowAdoptionModal(true); // Abre el modal de adopción para mascotas
        } else {
            onAction(item); // Compra directa para productos
        }
    };

    return (
        <>
            <div className="group relative flex transform flex-col overflow-hidden rounded-xl bg-white text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-800 dark:text-gray-200">
                {/* Contenedor de la imagen */}
                <div className="relative h-48 w-full">
                    <img
                        src={item.imagen ? `/storage/${item.imagen}` : 'https://via.placeholder.com/300'}
                        alt={item.nombre}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span
                        className={`absolute top-2 right-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            item.tipo === 'producto'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300'
                                : 'bg-pink-100 text-pink-800 dark:bg-pink-900/70 dark:text-pink-300'
                        }`}
                    >
                        {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </span>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="flex flex-grow flex-col p-4">
                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{item.nombre}</h3>
                    <p className="mb-4 line-clamp-2 flex-grow text-sm text-gray-600 dark:text-gray-400">{item.descripcion}</p>

                    <div className="mb-4 text-xl font-semibold text-green-600 dark:text-green-400">
                        {item.tipo === 'producto'
                            ? item.precio !== null && item.precio !== undefined
                                ? `$${item.precio.toLocaleString('es-CO')}`
                                : 'Precio no disponible'
                            : 'En Adopción'}
                    </div>

                    {/* ✨ SECCIÓN "PUBLICADO POR" RESTAURADA ✨ */}
                    <div className="mb-3 border-t border-gray-200 pt-3 text-right text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        {esPropietario ? (
                            <span>
                                Publicado por <span className="font-semibold">ti</span>
                            </span>
                        ) : (
                            item.user?.name && (
                                <span>
                                    Publicado por: <span className="font-semibold">{item.user.name}</span>
                                </span>
                            )
                        )}
                    </div>

                    {/* Botones de Acción Condicionales */}
                    <div className="mt-auto">
                        {esCliente ? (
                            // --- Vista para Cliente ---
                            <button
                                onClick={handleActionClick}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                {item.tipo === 'producto' ? (
                                    <>
                                        <ShoppingCart className="h-5 w-5" /> Comprar
                                    </>
                                ) : (
                                    <>
                                        <Heart className="h-5 w-5" /> Adoptar
                                    </>
                                )}
                            </button>
                        ) : (
                            // --- Vista para Admin y Aliado ---
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{esPropietario ? 'Tus acciones:' : 'Acciones de Admin:'}</span>
                                <div className="flex gap-2">
                                    {/* Botón de Editar */}
                                    {esPropietario && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="rounded-full p-2 text-blue-500 transition hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                    )}
                                    {/* Botón de Eliminar */}
                                    {(esAdmin || esPropietario) && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="rounded-full p-2 text-red-500 transition hover:bg-red-100 dark:hover:bg-red-900/50"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Renderizado condicional del modal de adopción */}
            {item.tipo === 'mascota' && <FormularioAdopcion mascota={item} show={showAdoptionModal} onClose={() => setShowAdoptionModal(false)} />}
        </>
    );
}
