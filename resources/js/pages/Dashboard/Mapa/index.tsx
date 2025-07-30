import { ThemeSwitcher } from '@/components/theme-switcher';
import { InteractiveMap } from '@/components/ui/interactive-map';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mapa',
        href: '/mapa',
    },
];

interface Location {
    id: string;
    city: string;
    count: number;
    shelters: number;
    lat: number;
    lng: number;
}

interface MapPageProps {
    locations: Location[];
    totalMascotas: number;
    totalCiudades: number;
    [key: string]: unknown;
}

export default function AdoptionMap() {
    const { locations, totalMascotas, totalCiudades } = usePage<MapPageProps>().props;
    const [selectedFilter, setSelectedFilter] = useState('all');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mapa de Adopciones" />
            <main className="relative z-0 flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 dark:from-green-600 dark:to-blue-700">
                {' '}
                <div className="container mx-auto">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        {/* Header con estadísticas */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mapa de Adopciones</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {totalMascotas} mascotas en {totalCiudades} ciudades
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => {
                                        setSelectedFilter(e.target.value);
                                        // Redirige a la misma página con el filtro de especie
                                        const especie = e.target.value === 'all' ? '' : e.target.value.slice(0, -1); // 'perros' -> 'perro', 'gatos' -> 'gato'
                                        window.location.href = especie ? `/mapa?especie=${especie}` : '/mapa';
                                    }}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">Todas las mascotas</option>
                                    <option value="perros">Perros</option>
                                    <option value="gatos">Gatos</option>
                                    <option value="otros">Otros</option>
                                </select>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>

                        {/* Mapa interactivo */}
                        <div className="mb-6">
                            {locations && locations.length > 0 ? (
                                <InteractiveMap locations={locations} />
                            ) : (
                                <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <div className="text-center">
                                        <p className="text-gray-500 dark:text-gray-400">No hay datos de ubicación disponibles</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">Agrega refugios con ciudades para ver el mapa</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Estadísticas por ciudad */}
                        {locations && locations.length > 0 && (
                            <div className="mb-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Distribución por Ciudad</h2>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                                    {locations.map((location) => (
                                        <div key={location.id} className="rounded-lg bg-gray-50 p-4 text-center shadow-sm dark:bg-gray-700">
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{location.city}</h3>
                                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{location.count}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">mascotas</p>
                                            {location.shelters > 0 && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {location.shelters} refugio{location.shelters > 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resumen general */}
                        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-4 dark:from-blue-900/20 dark:to-green-900/20">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalMascotas}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de mascotas</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCiudades}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ciudades con refugios</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {locations ? locations.reduce((acc, loc) => acc + loc.shelters, 0) : 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Refugios activos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ThemeSwitcher />
        </AppLayout>
    );
}
