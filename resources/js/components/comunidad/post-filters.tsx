// resources/js/components/comunidad/post-filters.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListFilter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface PostFiltersProps {
    onFiltersChange?: (filters: { search: string; categories: string[] }) => void;
}

export default function PostFilters({ onFiltersChange }: PostFiltersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [tempSearch, setTempSearch] = useState('');

    const categories = [
        { id: 'Campaña', label: 'Campañas', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        { id: 'Noticia', label: 'Noticias', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        { id: 'Consejo', label: 'Consejos', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        { id: 'General', label: 'General', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
    ];

    const handleCategoryToggle = (categoryId: string) => {
        const newSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((cat) => cat !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(newSelectedCategories);

        if (onFiltersChange) {
            onFiltersChange({
                search: searchTerm,
                categories: newSelectedCategories,
            });
        }
    };

    const handleSearch = () => {
        setSearchTerm(tempSearch);
        if (onFiltersChange) {
            onFiltersChange({
                search: tempSearch,
                categories: selectedCategories,
            });
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const removeFilter = (type: 'search' | 'category', value?: string) => {
        if (type === 'search') {
            setSearchTerm('');
            setTempSearch('');
            if (onFiltersChange) {
                onFiltersChange({
                    search: '',
                    categories: selectedCategories,
                });
            }
        } else if (type === 'category' && value) {
            const newCategories = selectedCategories.filter((cat) => cat !== value);
            setSelectedCategories(newCategories);
            if (onFiltersChange) {
                onFiltersChange({
                    search: searchTerm,
                    categories: newCategories,
                });
            }
        }
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setTempSearch('');
        setSelectedCategories([]);
        if (onFiltersChange) {
            onFiltersChange({
                search: '',
                categories: [],
            });
        }
    };

    const hasActiveFilters = searchTerm || selectedCategories.length > 0;

    return (
        <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 flex items-center text-lg font-bold text-gray-900 dark:text-white">
                <ListFilter className="mr-2 h-5 w-5 text-teal-600" />
                Filtrar Publicaciones
            </h3>

            {/* Búsqueda */}
            <div className="mb-6">
                <div className="flex gap-2">
                    <Input
                        placeholder="Buscar por palabra clave..."
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className="flex-1"
                    />
                    <Button onClick={handleSearch} size="icon" className="bg-teal-600 text-white hover:bg-teal-700">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Categorías */}
            <div className="mb-6">
                <p className="mb-3 font-semibold text-gray-900 dark:text-white">Categorías</p>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategories.includes(category.id) ? 'default' : 'ghost'}
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`w-full justify-start transition-all ${
                                selectedCategories.includes(category.id)
                                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <span className={`mr-2 h-3 w-3 rounded-full ${category.color.split(' ')[0]}`}></span>
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Filtros activos */}
            {hasActiveFilters && (
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Filtros activos</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Limpiar todo
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {/* Filtro de búsqueda */}
                        {searchTerm && (
                            <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-sm dark:bg-teal-900/20">
                                <Search className="h-3 w-3 text-teal-600" />
                                <span className="flex-1 truncate text-teal-800 dark:text-teal-200">"{searchTerm}"</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFilter('search')}
                                    className="h-5 w-5 p-0 text-teal-600 hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-teal-800"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        )}

                        {/* Filtros de categoría */}
                        {selectedCategories.map((categoryId) => {
                            const category = categories.find((cat) => cat.id === categoryId);
                            if (!category) return null;

                            return (
                                <div key={categoryId} className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                                    <span className={`h-2 w-2 rounded-full ${category.color.split(' ')[0]}`}></span>
                                    <span className="flex-1 text-gray-700 dark:text-gray-300">{category.label}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFilter('category', categoryId)}
                                        className="h-5 w-5 p-0 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
