import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import CarouselModal from '@/components/ui/carousel-modal';
import { FavoritesProvider, useFavorites } from '@/contexts/FavoritesContext';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Heart, MapPin, User } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Favoritos',
        href: '/favoritos',
    },
];

interface MascotaImage {
    id: number;
    imagen_path: string;
    orden: number;
}

interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    raza?: string;
    edad: number;
    sexo: string;
    ciudad: string;
    descripcion: string;
    imagen?: string;
    images?: MascotaImage[];
    user: {
        id: number;
        name: string;
    };
}

interface FavoritosProps {
    favoritos: Mascota[];
}

function FavoritePetsContent({ favoritos = [] }: FavoritosProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { removeFromFavorites, isLoading } = useFavorites();

    const handlePetClick = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    const handleRemoveFavorite = async (mascotaId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        await removeFromFavorites(mascotaId);
        // Recargar la página para actualizar la lista
        window.location.reload();
    };

    // Convertir favoritos al formato esperado por el modal
    const modalItems = useMemo(() => {
        return favoritos.map((mascota) => {
            // Construir array de imágenes
            const images: string[] = [];

            // Agregar imagen principal si existe
            if (mascota.imagen) {
                images.push(`/storage/${mascota.imagen}`);
            }

            // Agregar imágenes adicionales de la relación 'images'
            if (mascota.images && mascota.images.length > 0) {
                mascota.images.forEach((img) => {
                    const imagePath = `/storage/${img.imagen_path}`;
                    if (!images.includes(imagePath)) {
                        images.push(imagePath);
                    }
                });
            }

            // Imagen por defecto si no hay ninguna
            if (images.length === 0) {
                images.push('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=400');
            }

            return {
                id: mascota.id,
                type: 'pet' as const,
                name: mascota.nombre,
                especie: mascota.especie,
                raza: mascota.raza,
                edad: mascota.edad,
                sexo: mascota.sexo,
                ciudad: mascota.ciudad,
                descripcion: mascota.descripcion,
                imageUrl: images[0],
                images: images,
                shelter: mascota.user.name,
            };
        });
    }, [favoritos]);

    return (
        <>
            <main className="flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 dark:from-green-600 dark:to-blue-700">
                <div className="container mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white">Mis Mascotas Favoritas</h1>
                        <div className="text-white/80">
                            {favoritos.length} {favoritos.length === 1 ? 'mascota' : 'mascotas'}
                        </div>
                    </div>

                    {favoritos.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {favoritos.map((pet, index) => {
                                const mainImage = pet.imagen
                                    ? `/storage/${pet.imagen}`
                                    : pet.images && pet.images.length > 0
                                      ? `/storage/${pet.images[0].imagen_path}`
                                      : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=400';

                                return (
                                    <div
                                        key={pet.id}
                                        className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800"
                                        onClick={() => handlePetClick(index)}
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={mainImage}
                                                alt={pet.nombre}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    Disponible
                                                </span>
                                                <button
                                                    onClick={(e) => handleRemoveFavorite(pet.id, e)}
                                                    disabled={isLoading}
                                                    className="rounded-full bg-white/90 p-1.5 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-gray-800/90 dark:hover:bg-red-900/20"
                                                >
                                                    <Heart className="h-4 w-4 fill-current" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pet.nombre}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {pet.especie} {pet.raza && `• ${pet.raza}`}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    {pet.especie}
                                                </span>
                                            </div>
                                            <div className="mb-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {pet.edad} {pet.edad === 1 ? 'año' : 'años'} • {pet.sexo}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{pet.ciudad}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    <span className="text-blue-600 dark:text-blue-400">{pet.user.name}</span>
                                                </div>
                                            </div>
                                            <p className="mb-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{pet.descripcion}</p>{' '}
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePetClick(index);
                                                    }}
                                                >
                                                    Ver detalles
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/20">
                                <Heart className="h-12 w-12 text-white/60" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">No tienes mascotas favoritas aún</h3>
                            <p className="mb-6 text-white/80">Explora mascotas y marca tus favoritas haciendo clic en el corazón</p>
                            <Link href="/mascotas">
                                <Button className="bg-white text-green-600 hover:bg-gray-100">Explorar mascotas</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal del carrusel */}
            <CarouselModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={modalItems} initialIndex={selectedIndex} />
        </>
    );
}

export default function FavoritePets({ favoritos = [] }: FavoritosProps) {
    return (
        <FavoritesProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Mascotas Favoritas" />
                <FavoritePetsContent favoritos={favoritos} />
                <ThemeSwitcher />
            </AppLayout>
        </FavoritesProvider>
    );
}
