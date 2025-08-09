/**
 * Página del directorio público de refugios
 *
 * Esta vista presenta el directorio completo de refugios de animales registrados
 * en AdoptaFácil, permitiendo a los usuarios conocer y contactar organizaciones:
 *
 * Características principales:
 * - Directorio completo de refugios verificados
 * - Información detallada de cada refugio (nombre, ubicación, contacto)
 * - Estadísticas de donaciones recibidas por refugio
 * - Sistema de ordenamiento por popularidad y donaciones
 * - Diseño responsive con tarjetas informativas
 *
 * Información mostrada por refugio:
 * - Nombre y descripción de la organización
 * - Ubicación geográfica y datos de contacto
 * - Total de donaciones recibidas
 * - Enlaces a redes sociales y sitio web
 * - Información del usuario responsable
 *
 * Funcionalidades:
 * - Vista en grid adaptable según tamaño de pantalla
 * - Hero section con información general
 * - Estado de carga para refugios sin datos
 * - Integración con sistema de donaciones
 *
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 * @since 2024
 */

import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import ShelterCard from '@/components/refugio/shelter-card';
import ShelterHero from '@/components/refugio/shelter-hero';
import { ThemeSwitcher } from '@/components/theme-switcher';
// 1. Importa el tipo `Shelter` desde tu archivo de tipos
import { type Shelter } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Refugios() {
    // 3. Usa el tipo importado para los props
    const { shelters } = usePage().props as unknown as { shelters: Shelter[] };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-800">
            <Head title="Refugios" />
            <Header />
            <ShelterHero />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
                    {shelters && shelters.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {shelters.map((shelter) => (
                                <ShelterCard key={shelter.id} shelter={shelter} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-16 text-center text-gray-500">
                            <h2 className="text-2xl font-semibold">Aún no hay refugios</h2>
                            <p className="mt-2">Vuelve pronto para ver las fundaciones aliadas a nuestra causa.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            <ThemeSwitcher />
        </div>
    );
}
