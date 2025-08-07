import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import PetCard from '@/components/mascotas/pet-card';
import PetHero from '@/components/mascotas/pet-hero';
import { ThemeSwitcher } from '@/components/theme-switcher';
import CarouselModal from '@/components/ui/carousel-modal';
import { useNotifications } from '@/components/ui/notification';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

// ACTUALIZADO: Asegúrate de que tu prop 'mascotas' incluya ciudad y sexo.
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
    sexo: string; // <-- AÑADIDO
    ciudad: string; // <-- AÑADIDO
    descripcion: string;
    imagen?: string;
    images?: MascotaImage[]; // <-- AÑADIDO: imágenes múltiples
    user: {
        id: number;
        name: string;
    };
}

interface MascotasProps {
    mascotas: Mascota[];
}

export default function Mascotas({ mascotas = [] }: MascotasProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { addNotification, NotificationContainer } = useNotifications();

    const getEspecieFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('especie') || 'all';
    };

    // ACTUALIZADO: Mapeamos también 'sexo' y 'ciudad' e imágenes múltiples.
    const allPets = useMemo(() => {
        return mascotas.map((mascota) => {
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
                        // Evitar duplicados
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
                sexo: mascota.sexo, // <-- AÑADIDO
                ciudad: mascota.ciudad, // <-- AÑADIDO
                descripcion: mascota.descripcion,
                imageUrl: images[0], // Primera imagen como principal
                images: images, // <-- AÑADIDO: todas las imágenes
                shelter: mascota.user.name,
            };
        });
    }, [mascotas]);

    // ACTUALIZADO: Se añaden los nuevos filtros al estado inicial.
    const [filters, setFilters] = useState({
        searchTerm: '',
        selectedEspecie: 'all',
        selectedEdad: 'all',
        selectedCiudad: 'all',
        selectedGenero: 'all',
    });

    useEffect(() => {
        const especieFromUrl = getEspecieFromUrl();
        if (especieFromUrl !== 'all') {
            setFilters((prev) => ({ ...prev, selectedEspecie: especieFromUrl }));
        }
    }, []);

    const handleFilterChange = (key: string, value: string | number | boolean) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handlePetClick = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    // Función para limpiar todos los filtros.
    const clearAllFilters = () => {
        setFilters({
            searchTerm: '',
            selectedEspecie: 'all',
            selectedEdad: 'all',
            selectedCiudad: 'all',
            selectedGenero: 'all',
        });
    };

    const filteredPets = useMemo(() => {
        return allPets.filter((pet) => {
            const searchTermMatch =
                pet.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                pet.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const especieMatch = filters.selectedEspecie === 'all' || pet.especie === filters.selectedEspecie;

            const edadMatch =
                filters.selectedEdad === 'all' ||
                (filters.selectedEdad === 'joven' && pet.edad <= 24) || // (0-2 años)
                (filters.selectedEdad === 'adulto' && pet.edad > 24 && pet.edad <= 84) || // (2-7 años)
                (filters.selectedEdad === 'senior' && pet.edad > 84); // (+7 años)

            // NUEVO: Lógica de filtros para ciudad y género.
            const ciudadMatch = filters.selectedCiudad === 'all' || pet.ciudad === filters.selectedCiudad;
            const generoMatch = filters.selectedGenero === 'all' || pet.sexo === filters.selectedGenero;

            return searchTermMatch && especieMatch && edadMatch && ciudadMatch && generoMatch;
        });
    }, [filters, allPets]);

    const availableEspecies = useMemo(() => {
        return Array.from(new Set(allPets.map((pet) => pet.especie)));
    }, [allPets]);

    // NUEVO: Obtener ciudades únicas para el filtro.
    const availableCiudades = useMemo(() => {
        return Array.from(new Set(allPets.map((pet) => pet.ciudad)));
    }, [allPets]);

    // NUEVO: Variable para saber si hay algún filtro activo.
    const anyFilterActive =
        filters.selectedEspecie !== 'all' || filters.selectedEdad !== 'all' || filters.selectedCiudad !== 'all' || filters.selectedGenero !== 'all';

    return (
        <FavoritesProvider showNotification={addNotification}>
            <div className="flex min-h-screen flex-col bg-white dark:bg-gray-800">
                <Head title="Mascotas" />
                <Header />
                <PetHero />

                <main className="flex-1">
                    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
                        {/* Contenedor de filtros */}
                        <div className="mb-8 flex flex-wrap items-center gap-4">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o descripción..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:flex-grow-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />

                            <select
                                value={filters.selectedEspecie}
                                onChange={(e) => handleFilterChange('selectedEspecie', e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">Todas las especies</option>
                                {availableEspecies.map((especie) => (
                                    <option key={especie} value={especie}>
                                        {especie}
                                    </option>
                                ))}
                            </select>

                            {/* NUEVO: Filtro de Ciudad */}
                            <select
                                value={filters.selectedCiudad}
                                onChange={(e) => handleFilterChange('selectedCiudad', e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">Todas las ciudades</option>
                                {availableCiudades.map((ciudad) => (
                                    <option key={ciudad} value={ciudad}>
                                        {ciudad}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.selectedEdad}
                                onChange={(e) => handleFilterChange('selectedEdad', e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">Todas las edades</option>
                                <option value="joven">Joven (0-2 años)</option>
                                <option value="adulto">Adulto (2-7 años)</option>
                                <option value="senior">Senior (7+ años)</option>
                            </select>

                            {/* NUEVO: Filtro de Género */}
                            <select
                                value={filters.selectedGenero}
                                onChange={(e) => handleFilterChange('selectedGenero', e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">Todos los géneros</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        </div>

                        {/* NUEVO: Sección para mostrar filtros activos y botón de limpieza general */}
                        {anyFilterActive && (
                            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filtros Activos:</span>
                                {/* Píldora para Especie */}
                                {filters.selectedEspecie !== 'all' && (
                                    <span className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {filters.selectedEspecie}
                                        <button onClick={() => handleFilterChange('selectedEspecie', 'all')} className="font-bold">
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {/* Píldora para Ciudad */}
                                {filters.selectedCiudad !== 'all' && (
                                    <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {filters.selectedCiudad}
                                        <button onClick={() => handleFilterChange('selectedCiudad', 'all')} className="font-bold">
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {/* Píldora para Edad */}
                                {filters.selectedEdad !== 'all' && (
                                    <span className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        {filters.selectedEdad}
                                        <button onClick={() => handleFilterChange('selectedEdad', 'all')} className="font-bold">
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {/* Píldora para Género */}
                                {filters.selectedGenero !== 'all' && (
                                    <span className="flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {filters.selectedGenero}
                                        <button onClick={() => handleFilterChange('selectedGenero', 'all')} className="font-bold">
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {/* Botón de Limpieza General */}
                                <button onClick={clearAllFilters} className="text-sm font-semibold text-red-600 hover:underline dark:text-red-400">
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        )}

                        {/* Grid de mascotas */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredPets.length > 0 ? (
                                filteredPets.map((pet, index) => (
                                    <PetCard
                                        key={pet.id}
                                        {...pet}
                                        onImageClick={() => handlePetClick(index)}
                                        onViewDetails={() => handlePetClick(index)}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full py-16 text-center text-gray-500">
                                    {allPets.length === 0
                                        ? 'No hay mascotas disponibles para adopción aún.'
                                        : 'No se encontraron mascotas con estos filtros.'}
                                </p>
                            )}
                        </div>
                    </div>
                </main>

                <Footer />
                <ThemeSwitcher />
                <NotificationContainer />

                <CarouselModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={filteredPets} initialIndex={selectedIndex} />
            </div>
        </FavoritesProvider>
    );
}
