import { ThemeSwitcher } from '@/components/theme-switcher';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Estadísticas',
        href: '/estadisticas',
    },
];

export default function AdoptionStats() {
    // Datos de ejemplo para estadísticas de adopción
    const monthlyStats = [
        { month: 'Enero', adoptions: 45, returns: 2, success: 95.6 },
        { month: 'Febrero', adoptions: 38, returns: 1, success: 97.4 },
        { month: 'Marzo', adoptions: 52, returns: 3, success: 94.2 },
        { month: 'Abril', adoptions: 61, returns: 2, success: 96.7 },
        { month: 'Mayo', adoptions: 57, returns: 4, success: 93.0 },
        { month: 'Junio', adoptions: 64, returns: 1, success: 98.4 },
    ];

    // Estadísticas generales
    const generalStats = {
        totalAdoptions: 317,
        averageMonthly: 52.8,
        successRate: 96.2,
        pendingRequests: 24,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estadísticas de Adopción" />
            <main className="flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 dark:from-green-600 dark:to-blue-700">
                <div className="container mx-auto">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Estadísticas de Adopción</h1>

                        {/* Resumen de estadísticas */}
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
                                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Adopciones</h3>
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{generalStats.totalAdoptions}</p>
                            </div>
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900">
                                <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Promedio Mensual</h3>
                                <p className="text-2xl font-bold text-green-800 dark:text-green-200">{generalStats.averageMonthly}</p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900">
                                <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Tasa de Éxito</h3>
                                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{generalStats.successRate}%</p>
                            </div>
                            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900">
                                <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Solicitudes Pendientes</h3>
                                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{generalStats.pendingRequests}</p>
                            </div>
                        </div>

                        {/* Tabla de estadísticas mensuales */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Mes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Adopciones
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Devoluciones
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Tasa de Éxito
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {monthlyStats.map((stat, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                                {stat.month}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{stat.adoptions}</td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{stat.returns}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                            stat.success >= 95
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                        }`}
                                                    >
                                                        {stat.success}%
                                                    </span>
                                                    <div className="ml-4 h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                                                        <div
                                                            className={`h-2.5 rounded-full ${stat.success >= 95 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                            style={{ width: `${stat.success}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 text-right">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                Ver informe completo
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <ThemeSwitcher />
        </AppLayout>
    );
}
