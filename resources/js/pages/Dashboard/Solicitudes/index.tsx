import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

// Tipos de datos que el controlador envía
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}
interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    imagen?: string;
    user_id: number;
}
interface Solicitud {
    id: number;
    estado: string;
    created_at: string;
    user_id: number;
    mascota_id: number;
    mascota: Mascota;
    // Datos personales
    nombre_completo: string;
    cedula: string;
    email: string;
    telefono: string;
    // Dirección
    direccion_ciudad: string;
    direccion_barrio: string;
    direccion_postal: string;
    // Vivienda
    tipo_vivienda: string;
    propiedad_vivienda: string;
    tiene_patio: string;
    permiten_mascotas_alquiler: string;
    // Convivientes
    cantidad_convivientes: number;
    hay_ninos: string;
    edades_ninos: string;
    todos_acuerdo_adopcion: string;
    // Otras mascotas
    tiene_otras_mascotas: string;
    otras_mascotas_detalles?: string;
    tuvo_mascotas_antes: string;
    que_paso_mascotas_anteriores?: string;
    // Motivaciones y expectativas
    porque_adopta: string;
    que_espera_convivencia: string;
    que_haria_problemas_comportamiento: string;
    acepta_visitas_seguimiento: string;
    // Compromisos
    acepta_proceso_evaluacion: boolean;
    acepta_cuidado_responsable: boolean;
    acepta_contrato_adopcion: boolean;
    // Comentario de rechazo
    comentario_rechazo?: string;
}
interface SolicitudesPageProps {
    solicitudes: Solicitud[];
    auth: { user: User };
}

export default function SolicitudesIndex({ auth, solicitudes }: SolicitudesPageProps) {
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [comentarioRechazo, setComentarioRechazo] = useState('');
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    const handleRejectWithComment = async () => {
        if (!selectedSolicitud) return;

        setIsSubmittingReject(true);
        try {
            const response = await fetch(route('solicitudes.updateEstado', selectedSolicitud.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    estado: 'Rechazada',
                    comentario_rechazo: comentarioRechazo,
                }),
            });

            if (response.ok) {
                await response.json();
                setSelectedSolicitud({
                    ...selectedSolicitud,
                    estado: 'Rechazada',
                    comentario_rechazo: comentarioRechazo,
                });
                setShowRejectModal(false);
                setComentarioRechazo('');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
        } finally {
            setIsSubmittingReject(false);
        }
    };

    const handleCancel = (solicitudId: number) => {
        if (confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
            router.delete(route('solicitudes.destroy', solicitudId), { preserveScroll: true });
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Aprobada':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'En Proceso':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Rechazada':
            case 'Cancelada':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    const breadcrumbs = [{ title: 'Solicitudes', href: route('solicitudes.index') }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Solicitudes" />
            <main className="flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 dark:from-green-600 dark:to-blue-700">
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {solicitudes.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mascota</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Fecha de Solicitud</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {solicitudes.map((solicitud) => (
                                                <TableRow key={solicitud.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    solicitud.mascota.imagen
                                                                        ? `/storage/${solicitud.mascota.imagen}`
                                                                        : 'https://via.placeholder.com/150'
                                                                }
                                                                alt={solicitud.mascota.nombre}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                            <span>{solicitud.mascota.nombre}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={getStatusBadgeClass(solicitud.estado)}>
                                                            {solicitud.estado}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(solicitud.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell className="flex justify-end gap-2 text-right">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="bg-gray-500 text-white hover:bg-gray-600"
                                                            onClick={() => setSelectedSolicitud(solicitud)}
                                                        >
                                                            Ver Detalle
                                                        </Button>
                                                        {solicitud.estado === 'Enviada' && (
                                                            <Button variant="destructive" size="icon" onClick={() => handleCancel(solicitud.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Cancelar Solicitud</span>
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p>Aún no has realizado ninguna solicitud de adopción.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal/Card para mostrar el detalle de la solicitud */}
                {selectedSolicitud && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <button
                                className="absolute top-3 right-3 z-10 rounded-full bg-white p-1 text-2xl text-gray-400 shadow transition-colors hover:text-red-500 dark:bg-gray-900"
                                onClick={() => setSelectedSolicitud(null)}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                            <div className="p-6">
                                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                                    Detalle de Solicitud de Adopción
                                </h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Datos del Solicitante</h3>
                                            <div className="space-y-2">
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Nombre completo:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.nombre_completo}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Cédula:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.cedula}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Email:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.email}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Teléfono:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.telefono}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Ciudad:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.direccion_ciudad}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Barrio:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.direccion_barrio}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Código Postal:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.direccion_postal}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Vivienda</h3>
                                            <div className="space-y-2">
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Tipo de vivienda:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.tipo_vivienda}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Propiedad de la vivienda:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.propiedad_vivienda}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Tiene patio:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.tiene_patio}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Permiten mascotas en alquiler?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.permiten_mascotas_alquiler}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Convivientes</h3>
                                            <div className="space-y-2">
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Cantidad de convivientes:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.cantidad_convivientes}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Hay niños?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.hay_ninos}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Edades de los niños:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.edades_ninos}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">
                                                        ¿Todos están de acuerdo con la adopción?:
                                                    </strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.todos_acuerdo_adopcion}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Otras Mascotas</h3>
                                            <div className="space-y-2">
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Tiene otras mascotas?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.tiene_otras_mascotas}
                                                    </span>
                                                </div>
                                                {selectedSolicitud.tiene_otras_mascotas === 'si' && selectedSolicitud.otras_mascotas_detalles && (
                                                    <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                        <strong className="text-green-600 dark:text-green-400">Detalles de otras mascotas:</strong>
                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                            {selectedSolicitud.otras_mascotas_detalles}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Tuvo mascotas antes?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.tuvo_mascotas_antes}
                                                    </span>
                                                </div>
                                                {selectedSolicitud.tuvo_mascotas_antes === 'si' && selectedSolicitud.que_paso_mascotas_anteriores && (
                                                    <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                        <strong className="text-green-600 dark:text-green-400">
                                                            ¿Qué pasó con las mascotas anteriores?:
                                                        </strong>
                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                            {selectedSolicitud.que_paso_mascotas_anteriores}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Detalles de Adopción</h3>
                                        <div className="space-y-2">
                                            <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <strong className="text-green-600 dark:text-green-400">¿Por qué desea adoptar?:</strong>
                                                <p className="mt-1 text-gray-600 dark:text-gray-300">{selectedSolicitud.porque_adopta}</p>
                                            </div>
                                            <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <strong className="text-green-600 dark:text-green-400">¿Qué espera de la convivencia?:</strong>
                                                <p className="mt-1 text-gray-600 dark:text-gray-300">{selectedSolicitud.que_espera_convivencia}</p>
                                            </div>
                                            <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <strong className="text-green-600 dark:text-green-400">
                                                    ¿Qué haría ante problemas de comportamiento?:
                                                </strong>
                                                <p className="mt-1 text-gray-600 dark:text-gray-300">
                                                    {selectedSolicitud.que_haria_problemas_comportamiento}
                                                </p>
                                            </div>
                                            <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <strong className="text-green-600 dark:text-green-400">¿Acepta visitas de seguimiento?:</strong>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                    {selectedSolicitud.acepta_visitas_seguimiento}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">
                                                Compromisos y Condiciones
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Acepta proceso de evaluación?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.acepta_proceso_evaluacion ? 'Sí' : 'No'}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Acepta cuidado responsable?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.acepta_cuidado_responsable ? 'Sí' : 'No'}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">¿Acepta contrato de adopción?:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.acepta_contrato_adopcion ? 'Sí' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Mascota Solicitada</h3>
                                            <div className="space-y-2">
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Nombre:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.mascota?.nombre}</span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Especie:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                        {selectedSolicitud.mascota?.especie}
                                                    </span>
                                                </div>
                                                <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                    <strong className="text-green-600 dark:text-green-400">Raza:</strong>
                                                    <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.mascota?.raza}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">Estado de la Solicitud</h3>
                                        <div className="space-y-2">
                                            <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <strong className="text-green-600 dark:text-green-400">Estado de la solicitud:</strong>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">{selectedSolicitud.estado}</span>
                                            </div>
                                            <div className="rounded-md border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <strong className="text-green-600 dark:text-green-400">Fecha de solicitud:</strong>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                    {new Date(selectedSolicitud.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {selectedSolicitud.estado === 'Rechazada' && selectedSolicitud.comentario_rechazo && (
                                                <div className="rounded-md border-red-300 bg-red-50 p-3 dark:border-red-600 dark:bg-red-900/20">
                                                    <strong className="text-green-600 dark:text-green-400">Motivo de rechazo:</strong>
                                                    <p className="mt-1 text-red-600 dark:text-red-400">{selectedSolicitud.comentario_rechazo}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex justify-end gap-4 pt-6">
                                    {auth.user.role === 'aliado' && selectedSolicitud.mascota?.user_id === auth.user.id && (
                                        <>
                                            <button
                                                type="button"
                                                className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                                                onClick={async () => {
                                                    if (!selectedSolicitud) return;
                                                    await fetch(route('solicitudes.updateEstado', selectedSolicitud.id), {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-Requested-With': 'XMLHttpRequest',
                                                            'X-CSRF-TOKEN':
                                                                (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
                                                        },
                                                        body: JSON.stringify({ estado: 'Aprobada' }),
                                                    });
                                                    setSelectedSolicitud({ ...selectedSolicitud, estado: 'Aprobada' });
                                                    window.location.reload();
                                                }}
                                                disabled={selectedSolicitud.estado === 'Aprobada'}
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-md bg-red-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
                                                onClick={() => {
                                                    setComentarioRechazo('');
                                                    setShowRejectModal(true);
                                                }}
                                                disabled={selectedSolicitud.estado === 'Rechazada'}
                                            >
                                                Rechazar
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSolicitud(null)}
                                        className="rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de comentario de rechazo */}
                {showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Rechazar Solicitud</h3>
                            <p className="mb-4 text-gray-600 dark:text-gray-300">
                                ¿Está seguro de que desea rechazar esta solicitud? Puede agregar un comentario explicando el motivo:
                            </p>
                            <textarea
                                value={comentarioRechazo}
                                onChange={(e) => setComentarioRechazo(e.target.value)}
                                placeholder="Motivo del rechazo (opcional)"
                                rows={4}
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                maxLength={1000}
                            />
                            <div className="mt-2 text-right text-sm text-gray-500">{comentarioRechazo.length}/1000 caracteres</div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setComentarioRechazo('');
                                    }}
                                    className="rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRejectWithComment}
                                    disabled={isSubmittingReject}
                                    className="rounded-md bg-red-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isSubmittingReject ? 'Rechazando...' : 'Confirmar Rechazo'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AppLayout>
    );
}
