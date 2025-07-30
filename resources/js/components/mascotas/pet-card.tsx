import { Button } from '@/components/ui/button';
import FormularioAdopcionModal from '@/components/ui/formulario-adopcion-modal';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface PetCardProps {
    id: number;
    name: string;
    especie: string;
    raza?: string;
    edad: number;
    descripcion: string;
    imageUrl: string;
    shelter: string;
    sexo?: string;
    ciudad?: string;
    onImageClick?: () => void;
    onViewDetails?: () => void;
}

export default function PetCard({
    id,
    name,
    especie,
    raza,
    edad,
    descripcion,
    imageUrl,
    shelter,
    sexo,
    ciudad,
    onImageClick,
    onViewDetails,
}: PetCardProps) {
    const [showAdoptionForm, setShowAdoptionForm] = useState(false);
    const { isFavorite, toggleFavorite, isLoading, isInitialized } = useFavorites();

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Verificar si el contexto está inicializado
        if (!isInitialized) {
            console.log('Contexto de favoritos no inicializado aún');
            return;
        }

        await toggleFavorite(id);
    };

    const isCurrentlyFavorite = isFavorite(id);

    return (
        <>
            <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
                <div className="cursor-pointer" onClick={onImageClick}>
                    <img
                        src={imageUrl}
                        alt={name}
                        width={400}
                        height={300}
                        className="h-60 w-full object-cover transition-all group-hover:scale-105"
                    />
                </div>
                <div className="bg-white p-4 dark:bg-gray-900">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {especie} {raza && `• ${raza}`}
                            </p>
                            <h3 className="text-lg font-semibold">{name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {edad} {edad === 1 ? 'año' : 'años'}
                            </p>
                            {sexo && <p className="text-sm text-gray-600 dark:text-gray-300">{sexo}</p>}
                            {ciudad && <p className="text-sm text-gray-600 dark:text-gray-300">📍 {ciudad}</p>}
                            <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{descripcion}</p>

                            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <ShieldCheck className="mr-1.5 h-4 w-4 text-green-500" />
                                <span className="text-blue-600 dark:text-blue-400">Publicado por: {shelter}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-20 bg-white/80 hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
                            onClick={handleFavoriteClick}
                            disabled={isLoading || !isInitialized}
                            title={isCurrentlyFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            <Heart
                                className={`h-5 w-5 transition-all duration-200 ${
                                    isCurrentlyFavorite ? 'scale-110 fill-red-500 text-red-500' : 'text-gray-600 hover:scale-105 hover:text-red-500'
                                } ${isLoading ? 'animate-pulse opacity-50' : ''}`}
                            />
                        </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Disponible para adopción</p>
                        <Button size="sm" className="z-20 bg-green-600 hover:bg-green-700" onClick={onViewDetails}>
                            Ver detalle
                        </Button>
                    </div>
                </div>
            </div>

            {/* Formulario de Adopción */}
            <FormularioAdopcionModal
                show={showAdoptionForm}
                onClose={() => setShowAdoptionForm(false)}
                mascota={{
                    id,
                    nombre: name,
                    type: 'pet',
                }}
            />
        </>
    );
}
