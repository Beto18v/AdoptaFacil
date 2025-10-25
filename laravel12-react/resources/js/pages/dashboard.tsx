/**
 * Dashboard principal de AdoptaFácil
 *
 * Panel de control administrativo que proporciona una vista general
 * del estado de la plataforma con métricas clave y estadísticas:
 *
 * Métricas principales:
 * - Total de mascotas registradas
 * - Total de adopciones exitosas
 * - Total de donaciones recibidas
 * - Total de usuarios registrados
 *
 * Funcionalidades de análisis:
 * - Comparación con período anterior (% de cambio)
 * - Gráfico de distribución de mascotas por especie
 * - Gráfico de adopciones por mes
 * - Tabla de actividad reciente
 *
 * Componentes utilizados:
 * - StatCard: Tarjetas de estadísticas con indicadores de cambio
 * - Chart: Gráficos interactivos para visualización de datos
 * - RecentTable: Tabla de actividades recientes
 *
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 * @since 2024
 */

import ChatbotWidget from '@/components/chatbot-widget';
import { ThemeSwitcher } from '@/components/theme-switcher';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RecentTable } from '../components/recent-table';
import { StatCard } from '../components/stat-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    totalMascotas: number;
    totalAdopciones: number;
    totalDonaciones: number;
    totalUsuarios: number;
    cambioMascotas: number;
    cambioAdopciones: number;
    cambioDonaciones: number;
    cambioUsuarios: number;
}

interface DistribucionTipo {
    name: string;
    value: number;
    total: number;
}

interface AdopcionMes {
    mes: string;
    adopciones: number;
}

interface ActividadReciente {
    id: number;
    tipo: string;
    mascota: string;
    usuario: string;
    estado: string;
    fecha: string;
}

interface DashboardProps {
    stats: DashboardStats;
    distribucionTipos: DistribucionTipo[];
    adopcionesPorMes: AdopcionMes[];
    actividadesRecientes: ActividadReciente[];
}

export default function Dashboard({ stats, actividadesRecientes }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <main className="flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 dark:from-green-600 dark:to-blue-700">
                <div className="container mx-auto">
                    {/* Título de la página */}
                    <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">Panel de Control</h1>

                    {/* Tarjetas de estadísticas */}
                    <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:grid-cols-4 md:gap-6">
                        <StatCard
                            title="Total Mascotas"
                            value={stats.totalMascotas.toLocaleString()}
                            icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            color="blue"
                            change={`${stats.cambioMascotas >= 0 ? '+' : ''}${stats.cambioMascotas}%`}
                        />
                        <StatCard
                            title="Adopciones"
                            value={stats.totalAdopciones.toLocaleString()}
                            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            color="green"
                            change={`${stats.cambioAdopciones >= 0 ? '+' : ''}${stats.cambioAdopciones}%`}
                        />
                        <StatCard
                            title="Donaciones"
                            value={`$${stats.totalDonaciones.toLocaleString('es-CO')}`}
                            icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            color="purple"
                            change={`${stats.cambioDonaciones >= 0 ? '+' : ''}${stats.cambioDonaciones}%`}
                        />
                        <StatCard
                            title="Usuarios"
                            value={stats.totalUsuarios.toLocaleString()}
                            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            color="orange"
                            change={`${stats.cambioUsuarios >= 0 ? '+' : ''}${stats.cambioUsuarios}%`}
                        />
                    </div>

                    {/* Tabla de actividades recientes */}
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Actividades recientes</h2>
                        <RecentTable activities={actividadesRecientes} />
                    </div>
                </div>
            </main>

            <ThemeSwitcher hasChatbot={true} />
            <ChatbotWidget />
        </AppLayout>
    );
}
