import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Share2, Star, MapPin, Calendar, User, ShoppingCart, Phone, MessageCircle, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarousel } from '@/hooks/use-carousel';
import FormularioAdopcionModal from '@/components/ui/formulario-adopcion-modal';
import { useFavorites } from '@/contexts/FavoritesContext';

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
            favoriteIds: []
        };
    }
}

interface BaseItem {
    id: number;
    imageUrl: string;
    images?: string[]; // <-- AÑADIDO: array de URLs de imágenes múltiples
    description?: string;
    shelter: string;
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
    
    const {
        currentIndex,
        goToNext,
        goToPrevious,
        goToIndex,
        isAutoPlaying,
        toggleAutoPlay,
        pauseAutoPlay,
        resumeAutoPlay
    } = useCarousel({
        totalItems: items.length,
        initialIndex,
        autoPlayInterval: 5000,
        enableAutoPlay: false
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
        items.forEach(item => {
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
            items.forEach(item => {
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
            setFavoriteState(prev => ({
                ...prev,
                [currentItem.id]: isFavorite(currentItem.id)
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
    const getCurrentFavoriteState = useCallback((petId: number) => {
        // Priorizar el estado local si existe, sino usar el del contexto
        return Object.prototype.hasOwnProperty.call(favoriteState, petId) ? favoriteState[petId] : isFavorite(petId);
    }, [favoriteState, isFavorite]);

    // Función optimizada para manejar favoritos
    const handleFavoriteClick = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (currentItem?.type === 'pet' && !favoritesLoading) {
            const petId = currentItem.id;
            const currentFavoriteState = getCurrentFavoriteState(petId);
            
            try {
                // Actualización optimista inmediata del estado local
                setFavoriteState(prev => ({
                    ...prev,
                    [petId]: !currentFavoriteState
                }));
                
                // Marcar que se han hecho cambios
                setFavoriteChanges(true);
                
                // Ejecutar la acción de toggle
                await toggleFavorite(petId);
                
                // No necesitamos hacer nada más aquí, el contexto ya maneja la sincronización
            } catch (error) {
                console.error('Error al cambiar favorito:', error);
                // Revertir el cambio optimista en caso de error
                setFavoriteState(prev => ({
                    ...prev,
                    [petId]: currentFavoriteState
                }));
                // No marcar cambios si hubo error
                setFavoriteChanges(false);
            }
        }
    }, [currentItem, favoritesLoading, toggleFavorite, getCurrentFavoriteState]);

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
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <Badge variant={isProduct ? "default" : "secondary"}>
                                    {isProduct ? "Producto" : "Mascota"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {currentIndex + 1} de {items.length}
                                </span>
                                {totalImages > 1 && (
                                    <Badge variant="outline" className="text-xs">
                                        Imagen {currentImageIndex + 1}/{totalImages}
                                    </Badge>
                                )}
                                {items.length > 1 && (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={toggleAutoPlay}
                                        className="ml-2"
                                    >
                                        {isAutoPlaying ? (
                                            <Pause className="h-4 w-4 mr-1" />
                                        ) : (
                                            <Play className="h-4 w-4 mr-1" />
                                        )}
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
                                        <Heart className={`h-5 w-5 transition-all duration-200 ${
                                            getCurrentFavoriteState(currentItem.id)
                                                ? 'fill-red-500 text-red-500 scale-110' 
                                                : 'text-gray-500 hover:text-red-400 hover:scale-105'
                                        } ${favoritesLoading ? 'animate-pulse opacity-50' : ''}`} />
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] max-h-[85vh] overflow-hidden">
                            {/* Image Section */}
                            <div 
                                className="relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
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
                                        className="max-w-full max-h-full object-contain"
                                        style={{ maxHeight: '85vh' }}
                                        onLoad={() => setImageLoading(false)}
                                    />
                                </AnimatePresence>

                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
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
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 z-20"
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
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 z-20"
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
                                            className="hidden lg:flex absolute left-4 md:left-6 top-4 md:top-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-white/20"
                                            onClick={() => {
                                                goToPrevious();
                                                pauseAutoPlay();
                                            }}
                                        >
                                            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 mr-1 md:mr-2" />
                                            <span className="font-semibold text-sm md:text-base">
                                                {isProduct ? 'Anterior' : 'Anterior'}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="hidden lg:flex absolute right-4 md:right-6 top-4 md:top-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-white/20"
                                            onClick={() => {
                                                goToNext();
                                                pauseAutoPlay();
                                            }}
                                        >
                                            <span className="font-semibold text-sm md:text-base">
                                                {isProduct ? 'Siguiente' : 'Siguiente'}
                                            </span>
                                            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 ml-1 md:ml-2" />
                                        </Button>
                                    </>
                                )}

                                {/* Image Dots Indicator */}
                                {totalImages > 1 && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                                        {currentImages.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`h-2 rounded-full transition-all duration-300 hover:bg-white ${
                                                    index === currentImageIndex 
                                                        ? 'bg-white w-6 shadow-lg' 
                                                        : 'bg-white/50 hover:bg-white/75 w-2'
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
                                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                        {items.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`h-3 rounded-full transition-all duration-300 hover:bg-white/90 ${
                                                    index === currentIndex 
                                                        ? 'bg-white w-10 shadow-lg' 
                                                        : 'bg-white/50 hover:bg-white/75 w-3'
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
                            <div className="p-6 flex flex-col">
                                <div className="flex-1">
                                    {/* Title and Basic Info */}
                                    <div className="mb-6">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {title}
                                        </h1>
                                        
                                        {isProduct ? (
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                    ${(currentItem as Product).precio.toLocaleString('es-CO')}
                                                </p>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4 mb-4">
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
                                                    <div className="flex items-center space-x-2 col-span-2">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm">{(currentItem as Pet).ciudad}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Species/Category Info */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {isProduct ? (
                                                <Badge variant="outline">{(currentItem as Product).category || 'Producto'}</Badge>
                                            ) : (
                                                <>
                                                    <Badge variant="outline">{(currentItem as Pet).especie}</Badge>
                                                    {(currentItem as Pet).raza && (
                                                        <Badge variant="outline">{(currentItem as Pet).raza}</Badge>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {isProduct ? (currentItem as Product).descripcion : (currentItem as Pet).descripcion}
                                        </p>
                                    </div>

                                    {/* Shelter/Seller Info */}
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h4 className="font-semibold mb-2">
                                            {isProduct ? 'Vendido por' : 'Publicado por'}
                                        </h4>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {currentItem.shelter.charAt(0).toUpperCase()}
                                            </div>
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
                                        <div className="flex gap-2 lg:hidden mb-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    goToPrevious();
                                                    pauseAutoPlay();
                                                }}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
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
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    )}

                                    {isProduct ? (
                                        <>
                                            <Button 
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" 
                                                size="lg"
                                                onClick={() => {
                                                    // Add to cart logic
                                                    console.log('Added to cart:', currentItem);
                                                }}
                                            >
                                                <ShoppingCart className="w-5 h-5 mr-2" />
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
                                                    <Phone className="w-4 h-4 mr-2" />
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
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Mensaje
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Button 
                                                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" 
                                                size="lg"
                                                onClick={() => {
                                                    setShowAdoptionForm(true);
                                                }}
                                            >
                                                <Heart className="w-5 h-5 mr-2" />
                                                Iniciar proceso de adopción
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="lg"
                                                className="py-4 w-full"
                                                onClick={() => {
                                                    // Question logic
                                                    console.log('Asking about pet:', currentItem);
                                                }}
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Preguntar sobre esta mascota
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>                )}
            </AnimatePresence>
            
            {/* Formulario de Adopción */}
            {currentItem && !isProduct && (
                <FormularioAdopcionModal
                    show={showAdoptionForm}
                    onClose={() => setShowAdoptionForm(false)}
                    mascota={{
                        id: currentItem.id,
                        nombre: currentItem.type === 'pet' ? (currentItem as Pet).name : 'Mascota sin nombre',
                        type: 'pet'
                    }}
                />
            )}
        </>
    );
}
