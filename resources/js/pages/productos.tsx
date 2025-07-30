import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import ProductCard from '@/components/productos/product-card';
import ProductFilters from '@/components/productos/product-filters';
import ProductHero from '@/components/productos/product-hero';
import { ThemeSwitcher } from '@/components/theme-switcher';
import CarouselModal from '@/components/ui/carousel-modal';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

// Interfaces para tipado (sin cambios)
interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen?: string;
    shelter: string;
    user: {
        id: number;
        name: string;
    };
}

interface ProductosProps {
    productos: Product[];
}

export default function Productos({ productos = [] }: ProductosProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const allProducts = useMemo(() => {
        return productos.map((producto) => ({
            id: producto.id,
            type: 'product' as const,
            nombre: producto.nombre || '',
            category: 'Productos',
            precio: producto.precio || 0,
            imageUrl: producto.imagen ? `/storage/${producto.imagen}` : 'https://images.unsplash.com/photo-1591946614725-3b9b0d5b248b?q=80&w=400',
            descripcion: producto.descripcion || '',
            seller: producto.user?.name || 'Usuario',
            shelter: producto.user?.name || 'Usuario',
        }));
    }, [productos]);

    const availableFilters = useMemo(() => {
        const categories = Array.from(new Set(allProducts.map((p) => p.category)));
        const prices = allProducts.map((p) => p.precio);
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 150000;

        return {
            categories,
            priceRange: [0, maxPrice] as [number, number],
        };
    }, [allProducts]);

    // El estado de los filtros ahora coincide con la estructura de `currentFilters`
    const [filters, setFilters] = useState({
        searchTerm: '',
        category: 'Todas', // Cambiado a 'category' para coincidir con la nueva prop
        priceLimit: availableFilters.priceRange[1],
    });

    const handleFilterChange = (key: string, value: string | number | boolean) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleProductClick = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            const searchTermMatch = (product.nombre || '').toLowerCase().includes((filters.searchTerm || '').toLowerCase());
            // Se usa `filters.category` en lugar de `filters.selectedCategory`
            const categoryMatch = filters.category === 'Todas' || product.category === filters.category;
            const priceMatch = product.precio <= filters.priceLimit;
            return searchTermMatch && categoryMatch && priceMatch;
        });
    }, [filters, allProducts]);

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-800">
            <Head title="Productos" />
            <Header />

            <main className="flex-1">
                <ProductHero />
                <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        <aside className="lg:col-span-1">
                            <ProductFilters priceRange={availableFilters.priceRange} onFilterChange={handleFilterChange} currentFilters={filters} />
                        </aside>
                        <section className="lg:col-span-3">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, index) => (
                                        <ProductCard
                                            key={product.id}
                                            {...product}
                                            onImageClick={() => handleProductClick(index)}
                                            onViewDetails={() => handleProductClick(index)}
                                        />
                                    ))
                                ) : (
                                    <p className="col-span-full py-16 text-center text-gray-500">
                                        {allProducts.length === 0
                                            ? 'No hay productos disponibles aún.'
                                            : 'No se encontraron productos con estos filtros.'}
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
            <ThemeSwitcher />

            <CarouselModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={filteredProducts} initialIndex={selectedIndex} />
        </div>
    );
}
