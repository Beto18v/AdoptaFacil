import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

// 1. Importa los componentes de sección que acabamos de crear
import CategoriesSection from '@/components/landing/categories-section';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import HeroSection from '@/components/landing/hero-section';
import PetsSection from '@/components/landing/pets-section';
import ProductsSection from '@/components/landing/products-section';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen?: string;
    user: {
        id: number;
        name: string;
    };
}

interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    raza?: string;
    edad: number;
    descripcion: string;
    imagen?: string;
    user: {
        id: number;
        name: string;
    };
}

interface IndexProps {
    productos: Product[];
    mascotas: Mascota[];
    todasLasMascotas: Mascota[]; // Todas las mascotas para calcular conteos correctos
}

export default function Welcome({ productos = [], mascotas = [], todasLasMascotas = [] }: IndexProps) {
    // Transformar productos de BD al formato esperado por ProductsSection (máximo 3, los más recientes)
    const products = useMemo(() => {
        return productos
            .slice(0, 3) // Limitar a los primeros 3 (asumiendo que vienen ordenados por fecha desde el backend)
            .map((producto) => ({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: `$${producto.precio ? producto.precio.toLocaleString('es-CO') : '0'}`,
                imageUrl: producto.imagen
                    ? `/storage/${producto.imagen}`
                    : 'https://images.unsplash.com/photo-1598133894005-6d5c4b6f634d?auto=format&fit=crop&w=800&q=60',
            }));
    }, [productos]);

    // Transformar mascotas de BD al formato esperado por PetsSection (máximo 3, las más recientes)
    const pets = useMemo(() => {
        return mascotas
            .slice(0, 3) // Limitar a las primeras 3 (asumiendo que vienen ordenadas por fecha desde el backend)
            .map((mascota) => ({
                name: mascota.nombre,
                breed: mascota.raza || mascota.especie,
                age: `${mascota.edad} ${mascota.edad === 1 ? 'año' : 'años'}`,
                description: mascota.descripcion,
                imageUrl: mascota.imagen
                    ? `/storage/${mascota.imagen}`
                    : 'https://images.unsplash.com/photo-1534361960057-19889db9621e?fm=jpg&q=60&w=3000',
            }));
    }, [mascotas]);

    // Calcular conteos dinámicos de perros y gatos usando TODAS las mascotas
    const categories = useMemo(() => {
        const perrosCount = todasLasMascotas.filter((m) => m.especie.toLowerCase() === 'perro').length;
        const gatosCount = todasLasMascotas.filter((m) => m.especie.toLowerCase() === 'gato').length;

        return [
            {
                emoji: '🐶',
                title: 'Perros',
                count: perrosCount.toString(),
                link: '/mascotas?especie=perro',
            },
            {
                emoji: '🐱',
                title: 'Gatos',
                count: gatosCount.toString(),
                link: '/mascotas?especie=gato',
            },
        ];
    }, [todasLasMascotas]);

    return (
        <>
            <Head title="Inicio" />
            <Header />

            <main className="relative z-10 w-full bg-white dark:bg-gray-800">
                {/* 1. Hero Section - Punto de entrada */}
                <HeroSection />

                {/* 2. Categorías - Navegación rápida y llamativa */}
                <CategoriesSection categories={categories} />

                {/* 3. Mascotas - Prioridad máxima, contenido principal */}
                <PetsSection pets={pets} />

                {/* 4. Productos - Complemento importante */}
                <ProductsSection products={products} />
            </main>

            <Footer />
            <ThemeSwitcher />
        </>
    );
}
