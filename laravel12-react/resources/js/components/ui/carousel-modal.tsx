import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FormularioAdopcionModal from '@/components/ui/formulario-adopcion-modal';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCarousel } from '@/hooks/use-carousel';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Heart,
    MapPin,
    MessageCircle,
    Pause,
    Phone,
    Play,
    Share2,
    ShoppingCart,
    Star,
    User,
    X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// Hook personalizado para manejar favoritos de manera opcional
function useOptionalFavorites() {
    try {
        return useFavorites();
    } catch {
        return {
            isFavorite: () => false,
            toggleFavorite: async () => {},
            isLoading: false,
            isInitialized: false,
            addToFavorites: async () => {},
            removeFromFavorites: async () => {},
            refreshFavorites: async () => {},
            favoriteIds: [],
        };
    }
}

interface BaseItem {
    id: number;
    imageUrl: string;
    images?: string[]; // <-- AÑADIDO: array de URLs de imágenes múltiples
    description?: string;
    shelter: string;
    user?: {
        id: number;
        name: string;
        avatar?: string;
    };
}

interface Product extends BaseItem {
    type: 'product';
    nombre: string;
    precio: number;
    descripcion: string;
    category?: string;
    seller?: string;
}

interface Pet extends BaseItem {
    type: 'pet';
    name: string;
    especie: string;
    raza?: string;
    edad: number;
    sexo?: string;
    ciudad?: string;
    descripcion: string;
}

type CarouselItem = Product | Pet;

interface CarouselModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CarouselItem[];
    initialIndex: number;
}

export default function CarouselModal({ isOpen, onClose, items, initialIndex }: CarouselModalProps) {
    const [imageLoading, setImageLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAdoptionForm, setShowAdoptionForm] = useState(false);
    const [favoriteState, setFavoriteState] = useState<Record<number, boolean>>({});
    const [favoriteChanges, setFavoriteChanges] = useState(false); // Flag para rastrear cambios

    // Hook de favoritos con manejo opcional - retorna funciones seguras si no hay contexto
    const { isFavorite, toggleFavorite, isLoading: favoritesLoading, favoriteIds, refreshFavorites } = useOptionalFavorites();

    const { currentIndex, goToNext, goToPrevious, goToIndex, isAutoPlaying, toggleAutoPlay, pauseAutoPlay, resumeAutoPlay } = useCarousel({
        totalItems: items.length,
        initialIndex,
        autoPlayInterval: 5000,
        enableAutoPlay: false,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, goToNext, goToPrevious, toggleAutoPlay, onClose]);

    // Reset image loading when index changes
    useEffect(() => {
        setImageLoading(true);
        setCurrentImageIndex(0); // <-- AÑADIDO: resetear índice de imagen
    }, [currentIndex]);

    // Sincronizar estado local de favoritos con el contexto global
    useEffect(() => {
        const newFavoriteState: Record<number, boolean> = {};
        items.forEach((item) => {
            if (item.type === 'pet') {
                newFavoriteState[item.id] = isFavorite(item.id);
            }
        });
        setFavoriteState(newFavoriteState);
    }, [favoriteIds, items, isFavorite, isOpen]); // Agregué isOpen para sincronizar al abrir

    // Inicializar estado de favoritos al abrir el modal
    useEffect(() => {
        if (isOpen) {
            const initialFavoriteState: Record<number, boolean> = {};
            items.forEach((item) => {
                if (item.type === 'pet') {
                    initialFavoriteState[item.id] = isFavorite(item.id);
                }
            });
            setFavoriteState(initialFavoriteState);
            setFavoriteChanges(false); // Reset del flag al abrir
        }
    }, [isOpen, items, isFavorite]);

    // Pause autoplay when modal is closed
    useEffect(() => {
        if (!isOpen) {
            pauseAutoPlay();
        }
    }, [isOpen, pauseAutoPlay]);

    // Sincronizar favoritos cuando el modal se cierra (solo si hay cambios)
    useEffect(() => {
        if (!isOpen && favoriteChanges && refreshFavorites) {
            // Delay pequeño para asegurar que cualquier operación pendiente se complete
            const timeoutId = setTimeout(() => {
                refreshFavorites();
                setFavoriteChanges(false); // Reset del flag
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [isOpen, favoriteChanges, refreshFavorites]);

    const currentItem = items[currentIndex];

    // Sincronizar estado cuando cambia el item actual en el carrusel
    useEffect(() => {
        if (currentItem && currentItem.type === 'pet') {
            setFavoriteState((prev) => ({
                ...prev,
                [currentItem.id]: isFavorite(currentItem.id),
            }));
        }
    }, [currentItem, isFavorite]);

    // Funciones para navegar entre las imágenes del elemento actual
    const currentImages = currentItem?.images || [currentItem?.imageUrl].filter(Boolean);
    const totalImages = currentImages.length;

    const goToNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
        setImageLoading(true);
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
        setImageLoading(true);
    };

    const currentDisplayImage = currentImages[currentImageIndex] || currentItem?.imageUrl;

    // Función helper para obtener el estado actual de favorito
    const getCurrentFavoriteState = useCallback(
        (petId: number) => {
            // Priorizar el estado local si existe, sino usar el del contexto
            return Object.prototype.hasOwnProperty.call(favoriteState, petId) ? favoriteState[petId] : isFavorite(petId);
        },
        [favoriteState, isFavorite],
    );

    // Función optimizada para manejar favoritos
    const handleFavoriteClick = useCallback(
        async (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            if (currentItem?.type === 'pet' && !favoritesLoading) {
                const petId = currentItem.id;
                const currentFavoriteState = getCurrentFavoriteState(petId);

                try {
                    // Actualización optimista inmediata del estado local
                    setFavoriteState((prev) => ({
                        ...prev,
                        [petId]: !currentFavoriteState,
                    }));

                    // Marcar que se han hecho cambios
                    setFavoriteChanges(true);

                    // Ejecutar la acción de toggle
                    await toggleFavorite(petId);

                    // No necesitamos hacer nada más aquí, el contexto ya maneja la sincronización
                } catch (error) {
                    console.error('Error al cambiar favorito:', error);
                    // Revertir el cambio optimista en caso de error
                    setFavoriteState((prev) => ({
                        ...prev,
                        [petId]: currentFavoriteState,
                    }));
                    // No marcar cambios si hubo error
                    setFavoriteChanges(false);
                }
            }
        },
        [currentItem, favoritesLoading, toggleFavorite, getCurrentFavoriteState],
    );

    if (!isOpen || !currentItem) return null;

    const isProduct = currentItem.type === 'product';
    const title = isProduct ? (currentItem as Product).nombre : (currentItem as Pet).name;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative mx-4 w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <Badge variant={isProduct ? 'default' : 'secondary'}>{isProduct ? 'Producto' : 'Mascota'}</Badge>
                                    <span className="text-sm text-gray-500">
                                        {currentIndex + 1} de {items.length}
                                    </span>
                                    {totalImages > 1 && (
                                        <Badge variant="outline" className="text-xs">
                                            Imagen {currentImageIndex + 1}/{totalImages}
                                        </Badge>
                                    )}
                                    {items.length > 1 && (
                                        <Button variant="outline" size="sm" onClick={toggleAutoPlay} className="ml-2">
                                            {isAutoPlaying ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
                                            {isAutoPlaying ? 'Pausar' : 'Auto'}
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {currentItem.type === 'pet' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleFavoriteClick}
                                            disabled={favoritesLoading}
                                            className="transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                            title={getCurrentFavoriteState(currentItem.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                        >
                                            <Heart
                                                className={`h-5 w-5 transition-all duration-200 ${
                                                    getCurrentFavoriteState(currentItem.id)
                                                        ? 'scale-110 fill-red-500 text-red-500'
                                                        : 'text-gray-500 hover:scale-105 hover:text-red-400'
                                                } ${favoritesLoading ? 'animate-pulse opacity-50' : ''}`}
                                            />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon">
                                        <Share2 className="h-5 w-5 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={onClose}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid max-h-[85vh] min-h-[600px] grid-cols-1 overflow-hidden lg:grid-cols-2">
                                {/* Image Section */}
                                <div
                                    className="relative flex items-center justify-center bg-gray-100 dark:bg-gray-800"
                                    onMouseEnter={pauseAutoPlay}
                                    onMouseLeave={resumeAutoPlay}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={`${currentItem.id}-${currentImageIndex}`}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            src={currentDisplayImage}
                                            alt={title}
                                            className="max-h-full max-w-full object-contain"
                                            style={{ maxHeight: '85vh' }}
                                            onLoad={() => setImageLoading(false)}
                                        />
                                    </AnimatePresence>

                                    {imageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                                                <p className="text-sm text-gray-500">Cargando imagen...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Arrows for Images */}
                                    {totalImages > 1 && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute top-1/2 left-2 z-20 -translate-y-1/2 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-gray-900/90"
                                                onClick={() => {
                                                    goToPreviousImage();
                                                    pauseAutoPlay();
                                                }}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute top-1/2 right-2 z-20 -translate-y-1/2 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-gray-900/90"
                                                onClick={() => {
                                                    goToNextImage();
                                                    pauseAutoPlay();
                                                }}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Navigation Arrows for Items - Only on desktop, moved to avoid button interference */}
                                    {items.length > 1 && (
                                        <>
                                            <Button
                                                variant="default"
                                                size="lg"
                                                className="absolute top-4 left-4 hidden rounded-xl border-2 border-white/20 bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl md:top-6 md:left-6 md:px-4 md:py-3 lg:flex dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                                                onClick={() => {
                                                    goToPrevious();
                                                    pauseAutoPlay();
                                                }}
                                            >
                                                <ChevronLeft className="mr-1 h-5 w-5 md:mr-2 md:h-6 md:w-6" />
                                                <span className="text-sm font-semibold md:text-base">{isProduct ? 'Anterior' : 'Anterior'}</span>
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="lg"
                                                className="absolute top-4 right-4 hidden rounded-xl border-2 border-white/20 bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl md:top-6 md:right-6 md:px-4 md:py-3 lg:flex dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                                                onClick={() => {
                                                    goToNext();
                                                    pauseAutoPlay();
                                                }}
                                            >
                                                <span className="text-sm font-semibold md:text-base">{isProduct ? 'Siguiente' : 'Siguiente'}</span>
                                                <ChevronRight className="ml-1 h-5 w-5 md:ml-2 md:h-6 md:w-6" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Image Dots Indicator */}
                                    {totalImages > 1 && (
                                        <div className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
                                            {currentImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`h-2 rounded-full transition-all duration-300 hover:bg-white ${
                                                        index === currentImageIndex ? 'w-6 bg-white shadow-lg' : 'w-2 bg-white/50 hover:bg-white/75'
                                                    }`}
                                                    onClick={() => {
                                                        setCurrentImageIndex(index);
                                                        setImageLoading(true);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Items Dots Indicator - Moved higher to avoid button interference */}
                                    {items.length > 1 && (
                                        <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 space-x-3 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
                                            {items.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`h-3 rounded-full transition-all duration-300 hover:bg-white/90 ${
                                                        index === currentIndex ? 'w-10 bg-white shadow-lg' : 'w-3 bg-white/50 hover:bg-white/75'
                                                    }`}
                                                    onClick={() => {
                                                        goToIndex(index);
                                                        setImageLoading(true);
                                                        pauseAutoPlay();
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex flex-col p-6">
                                    <div className="flex-1">
                                        {/* Title and Basic Info */}
                                        <div className="mb-6">
                                            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>

                                            {isProduct ? (
                                                <div className="mb-4 flex items-center justify-between">
                                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                        ${(currentItem as Product).precio.toLocaleString('es-CO')}
                                                    </p>
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                        <span className="ml-2 text-sm text-gray-500">(4.8)</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm">
                                                            {(currentItem as Pet).edad} {(currentItem as Pet).edad === 1 ? 'año' : 'años'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm">{(currentItem as Pet).sexo || 'No especificado'}</span>
                                                    </div>
                                                    {(currentItem as Pet).ciudad && (
                                                        <div className="col-span-2 flex items-center space-x-2">
                                                            <MapPin className="h-4 w-4 text-gray-500" />
                                                            <span className="text-sm">{(currentItem as Pet).ciudad}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Species/Category Info */}
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {isProduct ? (
                                                    <Badge variant="outline">{(currentItem as Product).category || 'Producto'}</Badge>
                                                ) : (
                                                    <>
                                                        <Badge variant="outline">{(currentItem as Pet).especie}</Badge>
                                                        {(currentItem as Pet).raza && <Badge variant="outline">{(currentItem as Pet).raza}</Badge>}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-6">
                                            <h3 className="mb-3 text-lg font-semibold">Descripción</h3>
                                            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                                {isProduct ? (currentItem as Product).descripcion : (currentItem as Pet).descripcion}
                                            </p>
                                        </div>

                                        {/* Shelter/Seller Info */}
                                        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                            <h4 className="mb-2 font-semibold">{isProduct ? 'Vendido por' : 'Publicado por'}</h4>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={currentItem.user?.avatar ? `/storage/${currentItem.user.avatar}` : undefined}
                                                        alt={currentItem.user?.name || currentItem.shelter}
                                                    />
                                                    <AvatarFallback className="bg-blue-600 font-semibold text-white">
                                                        {(currentItem.user?.name || currentItem.shelter).charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{currentItem.shelter}</p>
                                                    <p className="text-sm text-gray-500">Miembro verificado</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {/* Mobile Navigation Buttons - Only visible on mobile */}
                                        {items.length > 1 && (
                                            <div className="mb-4 flex gap-2 lg:hidden">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        goToPrevious();
                                                        pauseAutoPlay();
                                                    }}
                                                >
                                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                                    Anterior
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        goToNext();
                                                        pauseAutoPlay();
                                                    }}
                                                >
                                                    Siguiente
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}

                                        {isProduct ? (
                                            <>
                                                <Button
                                                    className="w-full bg-blue-600 py-6 text-lg hover:bg-blue-700"
                                                    size="lg"
                                                    onClick={() => {
                                                        // Add to cart logic
                                                        console.log('Added to cart:', currentItem);
                                                    }}
                                                >
                                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                                    Agregar al carrito - ${(currentItem as Product).precio.toLocaleString('es-CO')}
                                                </Button>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        className="py-4"
                                                        onClick={() => {
                                                            // Call logic
                                                            console.log('Calling seller:', currentItem.shelter);
                                                        }}
                                                    >
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Llamar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        className="py-4"
                                                        onClick={() => {
                                                            // Message logic
                                                            console.log('Messaging seller:', currentItem.shelter);
                                                        }}
                                                    >
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        Mensaje
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    className="w-full bg-green-600 py-6 text-lg hover:bg-green-700"
                                                    size="lg"
                                                    onClick={() => {
                                                        setShowAdoptionForm(true);
                                                    }}
                                                >
                                                    <Heart className="mr-2 h-5 w-5" />
                                                    Iniciar proceso de adopción
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="w-full py-4"
                                                    onClick={() => {
                                                        // Question logic
                                                        console.log('Asking about pet:', currentItem);
                                                    }}
                                                >
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    Preguntar sobre esta mascota
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Formulario de Adopción */}
            {currentItem && !isProduct && (
                <FormularioAdopcionModal
                    show={showAdoptionForm}
                    onClose={() => setShowAdoptionForm(false)}
                    mascota={{
                        id: currentItem.id,
                        nombre: currentItem.type === 'pet' ? (currentItem as Pet).name : 'Mascota sin nombre',
                        type: 'pet',
                    }}
                />
            )}
        </>
    );
}
