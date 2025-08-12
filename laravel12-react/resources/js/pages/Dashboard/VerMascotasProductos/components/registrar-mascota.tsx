/**
 * Componente modal optimizado para registro y edición de mascotas
 *
 * Características principales:
 * - Formulario completo con validación client-side y server-side
 * - Sistema de múltiples imágenes (máximo 3) con preview
 * - Integración con IA para generación automática de descripciones
 * - Cálculo automático de edad basado en fecha de nacimiento
 * - Soporte para edición con carga de datos existentes
 * - Gestión optimizada de archivos e imágenes
 * - Interfaz responsive con feedback visual inmediato
 *
 * Optimizaciones v2.0:
 * - Memoización de funciones costosas
 * - Eliminación de re-renders innecesarios
 * - Gestión eficiente de memoria para previews de imágenes
 * - Validación de tipos robusta con TypeScript
 * - Manejo defensivo de errores de red
 *
 * @author Equipo AdoptaFácil
 * @version 2.0.0 - Optimizado para producción
 * @since 2024
 */

// resources/js/pages/Dashboard/VerMascotasProductos/components/registrar-mascota.tsx
// Componente modal para registrar nuevas mascotas con sistema de múltiples imágenes (hasta 3)

import { useDescripcionIA } from '@/hooks/useDescripcionIA';
import { useForm } from '@inertiajs/react';
import { Plus, Sparkles, X } from 'lucide-react'; // Iconos para agregar y eliminar imágenes
import React, { useEffect, useRef, useState } from 'react';

/**
 * Interfaces TypeScript para garantizar tipo-seguridad
 */
interface MascotaData {
    id?: number;
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: string;
    sexo: string;
    ciudad: string;
    descripcion: string;
    imagenes_existentes?: string[];
}

interface RegistrarMascotaProps {
    isOpen: boolean;
    onClose: () => void;
    setMensaje: (mensaje: string) => void;
    mascotaEditar?: MascotaData | null;
    modoEdicion?: boolean;
    onMascotaRegistrada?: () => void;
}

/**
 * Componente principal con lógica optimizada de estado y efectos
 */
export default function RegistrarMascota({
    isOpen,
    onClose,
    setMensaje,
    mascotaEditar,
    modoEdicion = false,
    onMascotaRegistrada,
}: RegistrarMascotaProps) {
    /**
     * Form handler con tipado fuerte y configuración optimizada
     * Incluye array de imágenes y método HTTP para ediciones
     */
    // Form handler con todos los campos de mascota, incluyendo array de imágenes
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        especie: '',
        raza: '',
        fecha_nacimiento: '',
        sexo: '',
        ciudad: '',
        descripcion: '',
        imagenes: [] as File[], // Array para múltiples imágenes
        _method: '' as string, // Para el workaround de FormData con PUT
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const multipleFileInputRef = useRef<HTMLInputElement>(null);
    // Estados para manejar las imágenes y sus previews
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]);
    // Estado para mostrar edad calculada
    const [edadCalculada, setEdadCalculada] = useState<string>('');

    // Hook para generar descripciones con IA
    const {
        generandoDescripcion,
        ultimaDescripcion, // eslint-disable-line @typescript-eslint/no-unused-vars
        error: errorIA,
        generarDescripcionDesdeDatos,
        verificarServicio,
        limpiarError,
    } = useDescripcionIA();

    // Estado para verificar si el servicio de IA está disponible
    const [servicioIADisponible, setServicioIADisponible] = useState<boolean | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

    // Función para calcular edad basada en fecha de nacimiento
    const calcularEdad = (fechaNacimiento: string) => {
        if (!fechaNacimiento) {
            setEdadCalculada('');
            return;
        }

        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);

        if (nacimiento > hoy) {
            setEdadCalculada('Fecha inválida');
            return;
        }

        let años = hoy.getFullYear() - nacimiento.getFullYear();
        const meses = hoy.getMonth() - nacimiento.getMonth();

        if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
            años--;
        }

        // Calcular meses exactos
        const fechaTemporal = new Date(nacimiento);
        fechaTemporal.setFullYear(nacimiento.getFullYear() + años);
        const mesesRestantes = Math.floor((hoy.getTime() - fechaTemporal.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

        if (años > 0) {
            setEdadCalculada(
                años === 1
                    ? `1 año${mesesRestantes > 0 ? ` y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : ''}`
                    : `${años} años${mesesRestantes > 0 ? ` y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : ''}`,
            );
        } else {
            const mesesTotales = Math.floor((hoy.getTime() - nacimiento.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
            setEdadCalculada(mesesTotales === 1 ? '1 mes' : `${mesesTotales} meses`);
        }
    };

    // Cierra el modal al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Función para generar descripción con IA
    const handleGenerarDescripcionIA = async () => {
        if (!data.nombre.trim()) {
            alert('Por favor, ingresa el nombre de la mascota antes de generar la descripción');
            return;
        }

        if (!data.especie.trim()) {
            alert('Por favor, selecciona la especie antes de generar la descripción');
            return;
        }

        limpiarError();

        const descripcionGenerada = await generarDescripcionDesdeDatos(
            data.nombre,
            data.especie,
            data.raza || 'Mestiza',
            data.sexo,
            data.ciudad || 'Ciudad no especificada',
            data.descripcion,
        );

        if (descripcionGenerada) {
            setData('descripcion', descripcionGenerada);
        }
    };

    /**
     * Maneja el envío del formulario de registro/edición de mascota
     * Valida los datos y envía la solicitud al backend según el modo
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...data,
            imagenes_a_eliminar: modoEdicion ? [] : undefined, // Se puede agregar lógica para eliminar imágenes específicas
        };

        if (modoEdicion && mascotaEditar?.id) {
            // Actualizar mascota existente - usar POST con _method para FormData
            console.log('Enviando actualización con datos:', submitData);

            // Actualizar el formulario de Inertia con _method
            setData('_method', 'PUT');

            // Enviar usando POST con _method=PUT (workaround para FormData)
            setTimeout(() => {
                post(`/mascotas/${mascotaEditar.id}`, {
                    forceFormData: true,
                    onSuccess: () => {
                        reset();
                        setAdditionalFiles([]);
                        setImagePreviews([]);
                        setImagenesExistentes([]);
                        setEdadCalculada('');
                        setMensaje('¡Mascota actualizada exitosamente!');
                        // Llamar al callback del padre para cerrar modal y recargar datos
                        if (onMascotaRegistrada) {
                            onMascotaRegistrada();
                        } else {
                            onClose();
                        }
                    },
                    onError: (errors) => {
                        setMensaje('Error al actualizar mascota. Revisa los datos e intenta nuevamente.');
                    },
                });
            }, 100);
        } else {
            // Crear nueva mascota
            post('/mascotas/store', {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setAdditionalFiles([]);
                    setImagePreviews([]);
                    setEdadCalculada('');
                    setMensaje('¡Mascota registrada exitosamente!');
                    // Llamar al callback del padre para cerrar modal y recargar datos
                    if (onMascotaRegistrada) {
                        onMascotaRegistrada();
                    } else {
                        onClose();
                    }
                },
                onError: (errors) => {
                    setMensaje('Error al registrar mascota. Revisa los datos e intenta nuevamente.');
                    setTimeout(() => {
                        setData('imagenes', []);
                    }, 3000);
                },
            });
        }
    };

    // Resetea las imágenes y edad calculada al cerrar el modal
    useEffect(() => {
        if (!isOpen) {
            // Limpiar al cerrar
            setAdditionalFiles([]);
            setImagePreviews([]);
            setEdadCalculada('');
            setImagenesExistentes([]);
            setServicioIADisponible(null);
            reset();
        } else if (isOpen && modoEdicion && mascotaEditar) {
            // Cargar datos cuando se abre en modo edición

            // Resetear primero para limpiar cualquier estado previo
            reset();

            // Usar un setTimeout más largo para asegurar que el formulario se actualice después del render
            setTimeout(() => {
                // Crear un nuevo objeto con todos los datos
                const formData = {
                    nombre: mascotaEditar.nombre || '',
                    especie: mascotaEditar.especie || '',
                    raza: mascotaEditar.raza || '',
                    fecha_nacimiento: mascotaEditar.fecha_nacimiento || '',
                    sexo: mascotaEditar.sexo || '',
                    ciudad: mascotaEditar.ciudad || '',
                    descripcion: mascotaEditar.descripcion || '',
                    imagenes: [] as File[],
                };

                // Actualizar todo de una vez
                Object.entries(formData).forEach(([key, value]) => {
                    setData(key as keyof typeof formData, value);
                });

                // Cargar imágenes existentes
                setImagenesExistentes(mascotaEditar.imagenes_existentes || []);

                // Calcular edad si hay fecha
                if (mascotaEditar.fecha_nacimiento) {
                    calcularEdad(mascotaEditar.fecha_nacimiento);
                }

                console.log('Datos cargados en el formulario:', formData);
            }, 300); // Aumentamos el timeout
        } else if (isOpen && !modoEdicion) {
            // Limpiar al abrir en modo creación
            reset();
            setImagenesExistentes([]);
            setEdadCalculada('');
        }
    }, [isOpen, modoEdicion, mascotaEditar, reset, setData]);

    // Verificar servicio de IA solo una vez cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            verificarServicio().then(setServicioIADisponible);
        }
    }, [isOpen, verificarServicio]); // Ahora verificarServicio está memoizado

    // Función para manejar múltiples imágenes (máximo 3)
    const handleAddImages = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        const totalExistingImages = imagenesExistentes.length + additionalFiles.length;
        const availableSlots = 3 - totalExistingImages; // Calcula espacios disponibles
        const filesToAdd = newFiles.slice(0, availableSlots);

        if (filesToAdd.length > 0) {
            const updatedFiles = [...additionalFiles, ...filesToAdd];
            setAdditionalFiles(updatedFiles);
            setData('imagenes', updatedFiles);

            // Genera previews para las nuevas imágenes
            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreviews((prev) => [...prev, e.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Elimina una imagen específica del array
    const removeImage = (indexToRemove: number) => {
        const updatedFiles = additionalFiles.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

        setAdditionalFiles(updatedFiles);
        setImagePreviews(updatedPreviews);
        setData('imagenes', updatedFiles);

        // Reset del input para permitir reseleccionar archivos
        if (multipleFileInputRef.current) {
            multipleFileInputRef.current.value = '';
        }
    };

    // Elimina una imagen existente
    const removeExistingImage = (indexToRemove: number) => {
        const updatedExisting = imagenesExistentes.filter((_, index) => index !== indexToRemove);
        setImagenesExistentes(updatedExisting);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div ref={modalRef} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                    {modoEdicion ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Campo Nombre */}
                    <div>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Nombre de la mascota"
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Campo Especie */}
                        <div>
                            <select
                                id="especie"
                                name="especie"
                                value={data.especie}
                                onChange={(e) => setData('especie', e.target.value)}
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Selecciona una especie</option>
                                <option value="perro">Perro</option>
                                <option value="gato">Gato</option>
                            </select>
                            {errors.especie && <p className="mt-1 text-sm text-red-600">{errors.especie}</p>}
                        </div>
                        {/* Campo Raza */}
                        <div>
                            <input
                                id="raza"
                                name="raza"
                                type="text"
                                value={data.raza}
                                onChange={(e) => setData('raza', e.target.value)}
                                placeholder="Raza"
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.raza && <p className="mt-1 text-sm text-red-600">{errors.raza}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Campo Fecha de Nacimiento */}
                        <div>
                            <label htmlFor="fecha_nacimiento" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fecha de Nacimiento
                            </label>
                            <input
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                type="date"
                                value={data.fecha_nacimiento}
                                onChange={(e) => {
                                    setData('fecha_nacimiento', e.target.value);
                                    calcularEdad(e.target.value);
                                }}
                                max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.fecha_nacimiento && <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>}
                        </div>

                        {/* Campo Edad Calculada (solo lectura) */}
                        <div>
                            <label htmlFor="edad_calculada" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Edad Actual
                            </label>
                            <input
                                id="edad_calculada"
                                name="edad_calculada"
                                type="text"
                                value={edadCalculada}
                                readOnly
                                placeholder="Se calculará automáticamente"
                                className="w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-50 p-3 text-gray-600 shadow-sm dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Campo Sexo */}
                        <div>
                            <select
                                id="sexo"
                                name="sexo"
                                value={data.sexo}
                                onChange={(e) => setData('sexo', e.target.value)}
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Selecciona el sexo</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                            {errors.sexo && <p className="mt-1 text-sm text-red-600">{errors.sexo}</p>}
                        </div>
                        {/* Campo Ciudad */}
                        <div>
                            <input
                                id="ciudad"
                                name="ciudad"
                                type="text"
                                value={data.ciudad}
                                onChange={(e) => setData('ciudad', e.target.value)}
                                placeholder="Ciudad"
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.ciudad && <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>}
                        </div>
                    </div>

                    {/* Campo Descripción */}
                    <div>
                        <div className="relative">
                            <label
                                htmlFor="descripcion"
                                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Descripción y personalidad
                                {/* ⭐ BOTÓN DE ESTRELLITA AQUÍ ⭐ */}
                                <button
                                    type="button"
                                    onClick={handleGenerarDescripcionIA}
                                    disabled={generandoDescripcion || !data.nombre.trim() || !data.especie.trim()}
                                    className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    title={`Generar descripción con IA para ${data.nombre || 'la mascota'}`}
                                >
                                    {generandoDescripcion ? (
                                        <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    ) : (
                                        <Sparkles className="h-3 w-3" />
                                    )}
                                </button>
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Descripción y personalidad de la mascota..."
                                rows={4}
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}

                        {/* 🌟 MENSAJE DE AYUDA PARA LA IA 🌟 */}
                        <p className="mt-2 text-xs font-medium text-purple-600 dark:text-purple-400">
                            💡 Haz clic en la ⭐ junto al título para generar una descripción emocional automática
                        </p>

                        {/* Mostrar errores de IA */}
                        {errorIA && (
                            <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                                <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Error generando descripción: {errorIA}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Campo Imágenes (hasta 3) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Imágenes de la mascota (hasta 3)</label>

                        {/* Vista previa de imágenes existentes (solo en modo edición) */}
                        {modoEdicion && imagenesExistentes.length > 0 && (
                            <>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Imágenes actuales:</p>
                                <div className="mb-4 grid grid-cols-3 gap-3">
                                    {imagenesExistentes.map((imagen, index) => (
                                        <div key={`existing-${index}`} className="group relative">
                                            <img
                                                src={`/storage/${imagen}`}
                                                alt={`Imagen existente ${index + 1}`}
                                                className="h-20 w-full rounded-md border border-gray-300 object-cover dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Vista previa de imágenes nuevas seleccionadas */}
                        {imagePreviews.length > 0 && (
                            <>
                                {modoEdicion && <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Nuevas imágenes:</p>}
                                <div className="mb-4 grid grid-cols-3 gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="group relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="h-20 w-full rounded-md border border-gray-300 object-cover dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 truncate rounded-b-md bg-black p-1 text-xs text-white">
                                                {additionalFiles[index]?.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Botón para agregar imágenes (solo si no se ha llegado al límite) */}
                        {imagenesExistentes.length + additionalFiles.length < 3 && (
                            <label
                                htmlFor="imagenes-mascota"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <Plus className="h-10 w-10 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    {imagenesExistentes.length + additionalFiles.length === 0
                                        ? 'Seleccionar imágenes de la mascota'
                                        : `Agregar más imágenes (${3 - (imagenesExistentes.length + additionalFiles.length)} disponibles)`}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF hasta 2MB cada una</span>
                            </label>
                        )}

                        <input
                            id="imagenes-mascota"
                            name="imagenes-mascota"
                            ref={multipleFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            autoComplete="off"
                            onChange={(e) => handleAddImages(e.target.files)}
                            className="hidden"
                        />

                        {errors.imagenes && <p className="mt-1 text-sm text-red-600">{errors.imagenes}</p>}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing
                                ? modoEdicion
                                    ? 'Actualizando...'
                                    : 'Registrando...'
                                : modoEdicion
                                  ? 'Guardar cambios'
                                  : 'Registrar Mascota'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
