// Componente modal para registro de productos con sistema de múltiples imágenes
import { useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react'; // Iconos para UI de imágenes
import React, { useEffect, useRef, useState } from 'react';

interface ProductoData {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: string;
    cantidad: string;
    imagenes_existentes?: string[];
}

interface RegistrarProductoProps {
    isOpen: boolean;
    onClose: () => void;
    setMensaje: (mensaje: string) => void;
    productoEditar?: ProductoData | null;
    modoEdicion?: boolean;
}

export default function RegistrarProducto({ isOpen, onClose, setMensaje, productoEditar, modoEdicion = false }: RegistrarProductoProps) {
    // Form handler para productos con array de imágenes
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        imagenes: [] as File[], // Array para hasta 3 imágenes
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const multipleFileInputRef = useRef<HTMLInputElement>(null);
    // Estados para gestión de archivos y previews
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modoEdicion && productoEditar?.id) {
            // Actualizar producto existente
            put(`/productos/${productoEditar.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setAdditionalFiles([]);
                    setImagePreviews([]);
                    setImagenesExistentes([]);
                    onClose();
                    setMensaje('¡Producto actualizado exitosamente!');
                },
                onError: () => {
                    setMensaje('Error al actualizar producto. Revisa los datos e intenta nuevamente.');
                    setTimeout(() => {
                        setData('imagenes', []);
                    }, 3000);
                },
            });
        } else {
            // Crear nuevo producto
            post('/productos/store', {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setAdditionalFiles([]);
                    setImagePreviews([]);
                    onClose();
                    setMensaje('¡Producto registrado exitosamente!');
                },
                onError: () => {
                    setMensaje('Error al registrar producto. Revisa los datos e intenta nuevamente.');
                    setTimeout(() => {
                        setData('imagenes', []);
                    }, 3000);
                },
            });
        }
    };

    // Resetea las imágenes al cerrar el modal
    useEffect(() => {
        if (!isOpen) {
            // Limpiar al cerrar
            setAdditionalFiles([]);
            setImagePreviews([]);
            setImagenesExistentes([]);
            reset();
        } else if (isOpen && modoEdicion && productoEditar) {
            // Cargar datos cuando se abre en modo edición
            console.log('Cargando datos de producto para editar:', productoEditar);

            // Resetear primero para limpiar cualquier estado previo
            reset();

            // Usar un setTimeout más largo para asegurar que el formulario se actualice después del render
            setTimeout(() => {
                // Crear un nuevo objeto con todos los datos
                const formData = {
                    nombre: productoEditar.nombre || '',
                    descripcion: productoEditar.descripcion || '',
                    precio: productoEditar.precio || '',
                    cantidad: productoEditar.cantidad || '',
                    imagenes: [] as File[],
                };

                // Actualizar todo de una vez
                Object.entries(formData).forEach(([key, value]) => {
                    setData(key as keyof typeof formData, value);
                });

                // Cargar imágenes existentes
                setImagenesExistentes(productoEditar.imagenes_existentes || []);

                console.log('Datos de producto cargados en el formulario:', formData);
            }, 300); // Aumentamos el timeout
        } else if (isOpen && !modoEdicion) {
            // Limpiar al abrir en modo creación
            reset();
            setImagenesExistentes([]);
        }
    }, [isOpen, modoEdicion, productoEditar, reset, setData]);

    // Maneja la selección de múltiples imágenes (máximo 3)
    const handleAddImages = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        const totalExistingImages = imagenesExistentes.length + additionalFiles.length;
        const availableSlots = 3 - totalExistingImages; // Espacios disponibles
        const filesToAdd = newFiles.slice(0, availableSlots);

        if (filesToAdd.length > 0) {
            const updatedFiles = [...additionalFiles, ...filesToAdd];
            setAdditionalFiles(updatedFiles);
            setData('imagenes', updatedFiles);

            // Genera previews para mostrar al usuario
            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreviews((prev) => [...prev, e.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Elimina imagen individual del array
    const removeImage = (indexToRemove: number) => {
        const updatedFiles = additionalFiles.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

        setAdditionalFiles(updatedFiles);
        setImagePreviews(updatedPreviews);
        setData('imagenes', updatedFiles);

        // Reset input para permitir reselección
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
                    {modoEdicion ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Campo Nombre */}
                    <div>
                        <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre del producto
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Nombre del producto"
                            autoComplete="off"
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                    </div>

                    {/* Campo Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción del producto
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Descripción del producto"
                            rows={3}
                            autoComplete="off"
                            className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Campo Precio */}
                        <div>
                            <label htmlFor="precio" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Precio
                            </label>
                            <input
                                id="precio"
                                name="precio"
                                type="number"
                                value={data.precio}
                                onChange={(e) => setData('precio', e.target.value)}
                                placeholder="Precio (ej: 25000)"
                                autoComplete="off"
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
                        </div>
                        {/* Campo Cantidad */}
                        <div>
                            <label htmlFor="cantidad" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cantidad disponible
                            </label>
                            <input
                                id="cantidad"
                                name="cantidad"
                                type="number"
                                value={data.cantidad}
                                onChange={(e) => setData('cantidad', e.target.value)}
                                placeholder="Cantidad disponible"
                                autoComplete="off"
                                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.cantidad && <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>}
                        </div>
                    </div>

                    {/* Campo Imágenes del producto (hasta 3) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Imágenes del producto (hasta 3)</label>

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
                                htmlFor="imagenes-producto"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <Plus className="h-10 w-10 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    {imagenesExistentes.length + additionalFiles.length === 0
                                        ? 'Seleccionar imágenes del producto'
                                        : `Agregar más imágenes (${3 - (imagenesExistentes.length + additionalFiles.length)} disponibles)`}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF hasta 2MB cada una</span>
                            </label>
                        )}

                        <input
                            id="imagenes-producto"
                            name="imagenes-producto"
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
                            className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing
                                ? modoEdicion
                                    ? 'Actualizando...'
                                    : 'Registrando...'
                                : modoEdicion
                                  ? 'Guardar cambios'
                                  : 'Registrar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
