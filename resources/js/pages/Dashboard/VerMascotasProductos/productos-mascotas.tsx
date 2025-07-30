// Dashboard unificado: productos y mascotas para gestión de aliados
import { ThemeSwitcher } from '@/components/theme-switcher';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ProductoMascotaCard, { type CardItem } from './components/producto-mascota-card';
import RegistrarMascota from './components/registrar-mascota';
import RegistrarProducto from './components/registrar-producto';

// Interfaces específicas para edición
interface MascotaEdicion {
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: string;
    sexo: string;
    ciudad: string;
    descripcion: string;
    imagenes_existentes: Array<{ id: number; ruta: string }>;
}

interface ProductoEdicion {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string;
    cantidad: string;
    imagenes_existentes: Array<{ id: number; ruta: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Productos y Mascotas', href: route('productos.mascotas') }];

export default function ProductosMascotas() {
    const page = usePage();
    const {
        items = [],
        auth,
        success,
    } = page.props as unknown as {
        items: CardItem[];
        auth: { user?: { role?: string } };
        success?: string;
    };
    const itemsTyped = items;
    const esAliado = auth.user?.role === 'aliado';

    // Estados del componente
    const [isMascotaModalOpen, setMascotaModalOpen] = useState(false);
    const [isProductoModalOpen, setProductoModalOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState<'todo' | 'producto' | 'mascota'>('todo');
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [adoptarMascotaId, setAdoptarMascotaId] = useState<number | null>(null);

    // Estados para edición
    const [mascotaEditando, setMascotaEditando] = useState<CardItem | null>(null);
    const [productoEditando, setProductoEditando] = useState<CardItem | null>(null);
    const [modoEdicion, setModoEdicion] = useState(false);

    // Mostrar mensaje de éxito del backend
    useEffect(() => {
        if (success) {
            mostrarMensaje(success as string);
        }
    }, [success]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const adoptarMascota = params.get('adoptar_mascota');
        if (adoptarMascota) {
            setAdoptarMascotaId(Number(adoptarMascota));
        }
    }, []);

    // Filtrado de items por búsqueda y tipo
    const productosFiltrados = itemsTyped.filter(
        (item) => (item.nombre || '').toLowerCase().includes((busqueda || '').toLowerCase()) && (filtro === 'todo' || item.tipo === filtro),
    );

    const mostrarMensaje = (msg: string) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(null), 4000);
    };

    // Función para cerrar modal de mascota y resetear edición
    const cerrarModalMascota = () => {
        setMascotaModalOpen(false);
        setMascotaEditando(null);
        setModoEdicion(false);
    };

    // Función para cerrar modal de producto y resetear edición
    const cerrarModalProducto = () => {
        setProductoModalOpen(false);
        setProductoEditando(null);
        setModoEdicion(false);
    };

    // Función para abrir modal de mascota en modo creación
    const abrirModalMascotaCreacion = () => {
        setMascotaEditando(null);
        setModoEdicion(false);
        setMascotaModalOpen(true);
    };

    // Función para abrir modal de producto en modo creación
    const abrirModalProductoCreacion = () => {
        setProductoEditando(null);
        setModoEdicion(false);
        setProductoModalOpen(true);
    };

    // Acción cliente: comprar/adoptar
    const handleAction = (item: CardItem) => {
        const actionType = item.tipo === 'producto' ? 'compra' : 'adopcion';
        router.post(
            route('acciones-solicitud.store'),
            { tipo: actionType, item_id: item.id },
            {
                onSuccess: () => mostrarMensaje(`¡Solicitud de ${actionType} enviada para "${item.nombre}"!`),
                onError: () => mostrarMensaje('Ocurrió un error al registrar la solicitud.'),
            },
        );
    };

    // Acción aliado: editar
    const handleEdit = async (item: CardItem) => {
        try {
            if (item.tipo === 'mascota') {
                // Obtener datos completos de la mascota desde el backend
                const response = await fetch(`/mascotas/${item.id}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.ok) {
                    const mascotaCompleta = await response.json();
                    setMascotaEditando({
                        ...item,
                        ...mascotaCompleta,
                    });
                } else {
                    // Fallback a datos básicos si no se pueden obtener datos completos
                    setMascotaEditando(item);
                }

                setModoEdicion(true);
                setMascotaModalOpen(true);
            } else if (item.tipo === 'producto') {
                // Obtener datos completos del producto desde el backend
                const response = await fetch(`/productos/${item.id}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.ok) {
                    const productoCompleto = await response.json();
                    setProductoEditando({
                        ...item,
                        ...productoCompleto,
                    });
                } else {
                    // Fallback a datos básicos si no se pueden obtener datos completos
                    setProductoEditando(item);
                }

                setModoEdicion(true);
                setProductoModalOpen(true);
            }
        } catch (error) {
            console.error('Error al obtener datos para edición:', error);
            // Fallback a datos básicos en caso de error
            if (item.tipo === 'mascota') {
                setMascotaEditando(item);
                setModoEdicion(true);
                setMascotaModalOpen(true);
            } else {
                setProductoEditando(item);
                setModoEdicion(true);
                setProductoModalOpen(true);
            }
        }
    };

    // Acción aliado: eliminar
    const handleDelete = (item: CardItem) => {
        if (confirm(`¿Estás seguro de que quieres eliminar "${item.nombre}"? Esta acción no se puede deshacer.`)) {
            const deleteUrl = item.tipo === 'producto' ? `/productos/${item.id}` : `/mascotas/${item.id}`;
            router.delete(deleteUrl, {
                preserveScroll: true,
                onSuccess: () => mostrarMensaje(`"${item.nombre}" ha sido eliminado.`),
                onError: (errors) => {
                    console.error('Error al eliminar:', errors);
                    mostrarMensaje('No se pudo eliminar el ítem.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos y Mascotas" />
            <main className="flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700">
                <div className="mx-auto max-w-7xl space-y-6 p-6">
                    {/* Mensaje de éxito */}
                    {mensaje && (
                        <div className="animate-fade-in rounded-lg border-l-4 border-green-500 bg-green-100 p-4 text-center text-green-800 shadow-lg dark:border-green-600 dark:bg-gray-800 dark:text-green-300">
                            {mensaje}
                        </div>
                    )}

                    {/* Botones de registro para Aliado */}
                    {esAliado && (
                        <div className="mb-6 flex justify-center gap-4">
                            <button
                                onClick={abrirModalMascotaCreacion}
                                className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-transform hover:scale-105"
                            >
                                Registrar Mascota
                            </button>
                            <button
                                onClick={abrirModalProductoCreacion}
                                className="rounded-lg bg-green-600 px-6 py-3 text-white shadow-md transition-transform hover:scale-105"
                            >
                                Registrar Producto
                            </button>
                        </div>
                    )}

                    {/* Modales de registro/edición */}
                    <RegistrarMascota
                        isOpen={isMascotaModalOpen}
                        onClose={cerrarModalMascota}
                        setMensaje={mostrarMensaje}
                        mascotaEditar={
                            mascotaEditando
                                ? {
                                      id: mascotaEditando.id,
                                      nombre: (mascotaEditando as unknown as MascotaEdicion).nombre || '',
                                      especie: (mascotaEditando as unknown as MascotaEdicion).especie || '',
                                      raza: (mascotaEditando as unknown as MascotaEdicion).raza || '',
                                      fecha_nacimiento: (mascotaEditando as unknown as MascotaEdicion).fecha_nacimiento || '',
                                      sexo: (mascotaEditando as unknown as MascotaEdicion).sexo || '',
                                      ciudad: (mascotaEditando as unknown as MascotaEdicion).ciudad || '',
                                      descripcion: (mascotaEditando as unknown as MascotaEdicion).descripcion || '',
                                      imagenes_existentes:
                                          (mascotaEditando as unknown as MascotaEdicion).imagenes_existentes?.map((img) => img.ruta) || [],
                                  }
                                : null
                        }
                        modoEdicion={modoEdicion && mascotaEditando !== null}
                    />
                    <RegistrarProducto
                        isOpen={isProductoModalOpen}
                        onClose={cerrarModalProducto}
                        setMensaje={mostrarMensaje}
                        productoEditar={
                            productoEditando
                                ? {
                                      id: productoEditando.id,
                                      nombre: (productoEditando as unknown as ProductoEdicion).nombre || '',
                                      descripcion: (productoEditando as unknown as ProductoEdicion).descripcion || '',
                                      precio: (productoEditando as unknown as ProductoEdicion).precio?.toString() || '0',
                                      cantidad: (productoEditando as unknown as ProductoEdicion).cantidad?.toString() || '1',
                                      imagenes_existentes:
                                          (productoEditando as unknown as ProductoEdicion).imagenes_existentes?.map((img) => img.ruta) || [],
                                  }
                                : null
                        }
                        modoEdicion={modoEdicion && productoEditando !== null}
                    />

                    {/* Filtros y búsqueda */}
                    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row dark:bg-gray-800">
                        <input
                            id="text"
                            name="text"
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre..."
                            className="w-full rounded-md border-gray-300 bg-white p-2 text-gray-900 transition focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        />
                        <select
                            id="filtro"
                            name="filtro"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value as 'todo' | 'producto' | 'mascota')}
                            className="filtro-gray-900 w-full rounded-md border-gray-300 bg-white p-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="todo">Todos</option>
                            <option value="producto">Solo productos</option>
                            <option value="mascota">Solo mascotas</option>
                        </select>
                    </div>
                    {/* --- INICIO DE LA CUADRÍCULA DE TARJETAS --- */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {productosFiltrados.map((item) => (
                            <ProductoMascotaCard
                                key={`${item.tipo}-${item.id}`}
                                item={item}
                                onAction={handleAction}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                autoOpenAdopcion={adoptarMascotaId === item.id}
                                onAutoOpenHandled={() => setAdoptarMascotaId(null)}
                            />
                        ))}
                    </div>
                    {/* --- FIN DE LA CUADRÍCULA DE TARJETAS --- */}
                    {productosFiltrados.length === 0 && (
                        <div className="animate-fade-in mt-10 rounded-lg bg-white p-16 text-center text-lg text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-400">
                            No se encontraron resultados que coincidan con tu búsqueda.
                        </div>
                    )}

                    {/* Mensaje de confirmación o error */}
                </div>
            </main>
            <ThemeSwitcher />
        </AppLayout>
    );
}
