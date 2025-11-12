import ChatbotWidget from '@/components/chatbot-widget';
import { ThemeSwitcher } from '@/components/theme-switcher';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface User {
    email: string;
    telefono?: string;
}

interface Mascota {
    nombre: string;
    especie: string;
    raza: string;
}

interface Solicitud {
    id: number;
    nombre_completo: string;
    cedula: string;
    acepta_proceso_evaluacion: boolean;
    acepta_cuidado_responsable: boolean;
    acepta_contrato_adopcion: boolean;
    estado: string;
    created_at: string;
    user?: User;
    mascota?: Mascota;
}

interface ShowProps {
    solicitud: Solicitud;
}

const breadcrumbs = [
    { title: 'Solicitudes', href: '/solicitudes' },
    { title: 'Detalle', href: '#' },
];

export default function Show({ solicitud }: ShowProps) {
    if (!solicitud) return <div>No se encontró la solicitud.</div>;

    const { user, mascota } = solicitud;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detalle de Solicitud" />
            <main className="relative flex-1 overflow-y-auto bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6 dark:from-green-600 dark:via-blue-700 dark:to-purple-800">
                {/* Elementos decorativos de fondo */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Círculos decorativos grandes */}
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                    <div className="absolute top-1/4 -right-32 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-300/10 blur-3xl"></div>

                    {/* Puntos animados */}
                    <div className="absolute top-20 right-20 h-3 w-3 animate-pulse rounded-full bg-white/20 shadow-lg"></div>
                    <div className="absolute top-1/3 left-1/4 h-4 w-4 animate-ping rounded-full bg-white/30 shadow-lg"></div>
                    <div className="absolute right-1/3 bottom-32 h-2 w-2 animate-pulse rounded-full bg-white/25 shadow-md"></div>
                </div>

                <div className="relative z-10 container mx-auto">
                    {/* Título de la página con gradiente */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-5xl lg:text-6xl">
                            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Detalle de Solicitud</span>
                        </h1>
                        <p className="mt-4 text-xl leading-relaxed font-medium text-white/90">Información completa de la solicitud</p>

                        {/* Línea decorativa */}
                        <div className="mx-auto mt-6 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    </div>

                    {/* Contenedor principal */}
                    <div className="relative overflow-hidden rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm dark:bg-gray-800/95">
                        {/* Elementos decorativos */}
                        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/10 to-purple-500/5 blur-2xl"></div>
                        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-500/10 to-blue-500/5 blur-xl"></div>

                        <div className="relative">
                            {/* Header de la sección */}
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Solicitud #{solicitud.id}</h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                        Estado: <span className="font-medium">{solicitud.estado}</span>
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-gradient-to-r from-orange-500/20 to-blue-500/20 p-3">
                                    <svg
                                        className="h-6 w-6 text-orange-600 dark:text-orange-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Línea decorativa */}
                            <div className="mb-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>

                            {/* Contenido de la solicitud */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Datos del Solicitante */}
                                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg dark:from-blue-900/20 dark:to-blue-800/20">
                                    <h3 className="mb-4 flex items-center text-lg font-semibold text-blue-700 dark:text-blue-300">
                                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Datos del Solicitante
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-blue-600 dark:text-blue-400">Nombre completo:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{solicitud.nombre_completo}</div>
                                        </div>
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-blue-600 dark:text-blue-400">Cédula:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{solicitud.cedula}</div>
                                        </div>
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-blue-600 dark:text-blue-400">Email:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{user?.email}</div>
                                        </div>
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-blue-600 dark:text-blue-400">Teléfono:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{user?.telefono || 'No registrado'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mascota Solicitada */}
                                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg dark:from-green-900/20 dark:to-green-800/20">
                                    <h3 className="mb-4 flex items-center text-lg font-semibold text-green-700 dark:text-green-300">
                                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        Mascota Solicitada
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-green-600 dark:text-green-400">Nombre:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{mascota?.nombre}</div>
                                        </div>
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-green-600 dark:text-green-400">Especie:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{mascota?.especie}</div>
                                        </div>
                                        <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                            <strong className="text-green-600 dark:text-green-400">Raza:</strong>
                                            <div className="text-gray-700 dark:text-gray-300">{mascota?.raza}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Respuestas del Formulario */}
                            <div className="mt-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg dark:from-purple-900/20 dark:to-purple-800/20">
                                <h3 className="mb-4 flex items-center text-lg font-semibold text-purple-700 dark:text-purple-300">
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Respuestas del Formulario
                                </h3>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                        <strong className="text-purple-600 dark:text-purple-400">¿Acepta proceso de evaluación?</strong>
                                        <div
                                            className={`font-medium ${solicitud.acepta_proceso_evaluacion ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                        >
                                            {solicitud.acepta_proceso_evaluacion ? 'Sí' : 'No'}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                        <strong className="text-purple-600 dark:text-purple-400">¿Acepta cuidado responsable?</strong>
                                        <div
                                            className={`font-medium ${solicitud.acepta_cuidado_responsable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                        >
                                            {solicitud.acepta_cuidado_responsable ? 'Sí' : 'No'}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                        <strong className="text-purple-600 dark:text-purple-400">¿Acepta contrato de adopción?</strong>
                                        <div
                                            className={`font-medium ${solicitud.acepta_contrato_adopcion ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                        >
                                            {solicitud.acepta_contrato_adopcion ? 'Sí' : 'No'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estado de la Solicitud */}
                            <div className="mt-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-lg dark:from-orange-900/20 dark:to-orange-800/20">
                                <h3 className="mb-4 flex items-center text-lg font-semibold text-orange-700 dark:text-orange-300">
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Estado de la Solicitud
                                </h3>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                        <strong className="text-orange-600 dark:text-orange-400">Estado:</strong>
                                        <div className="font-medium text-gray-700 dark:text-gray-300">{solicitud.estado}</div>
                                    </div>
                                    <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                                        <strong className="text-orange-600 dark:text-orange-400">Fecha de solicitud:</strong>
                                        <div className="text-gray-700 dark:text-gray-300">{new Date(solicitud.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="mt-8 flex justify-center">
                                <Link
                                    href="/solicitudes"
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-800 hover:shadow-xl"
                                >
                                    {/* Efecto de brillo */}
                                    <div className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]"></div>

                                    {/* Contenido del botón */}
                                    <div className="relative flex items-center gap-2">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Volver a Solicitudes
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ThemeSwitcher hasChatbot={true} />
            <ChatbotWidget />
        </AppLayout>
    );
}
