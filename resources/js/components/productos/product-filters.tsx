// No es necesario crear un nuevo archivo, puedes reemplazar el contenido de tu 'ProductFilters' existente.
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListFilter } from 'lucide-react';

interface ProductFiltersProps {
    // Función para manejar todos los cambios de filtro
    onFilterChange: (key: string, value: string | number) => void;
    // Estado actual de los filtros para sincronizar la UI
    currentFilters: {
        searchTerm: string;
        priceLimit: number;
    };
    // Rango de precios para el slider
    priceRange: [number, number];
}

export default function ProductFilters({ onFilterChange, currentFilters, priceRange }: ProductFiltersProps) {
    return (
        // Se usa "sticky" como en PostFilters para que se quede fijo al bajar
        <div className="sticky top-24 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            {/* Título unificado con el ícono de ListFilter */}
            <h3 className="mb-6 flex items-center text-lg font-bold">
                <ListFilter className="mr-2 h-5 w-5" />
                Filtros
            </h3>

            <div className="grid gap-8">
                {/* 1. Filtro de Búsqueda por palabra clave */}
                <div className="grid gap-2">
                    <Label htmlFor="search" className="font-semibold">
                        Buscar
                    </Label>
                    <Input
                        id="search"
                        placeholder="Buscar productos..."
                        value={currentFilters.searchTerm}
                        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                    />
                </div>

                {/* 2. Filtro por Rango de Precios */}
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="price" className="font-semibold">
                            Precio máximo
                        </Label>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                            ${currentFilters.priceLimit ? currentFilters.priceLimit.toLocaleString('es-CO') : '0'}
                        </span>
                    </div>
                    <Input
                        id="price"
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={currentFilters.priceLimit}
                        step={5000}
                        onChange={(e) => onFilterChange('priceLimit', Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                    />
                </div>
            </div>
        </div>
    );
}
