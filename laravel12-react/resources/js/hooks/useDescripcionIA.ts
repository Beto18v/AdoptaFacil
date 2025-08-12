/**
 * Hook optimizado para integración con IA de generación de descripciones
 *
 * Proporciona funcionalidades completas para generar descripciones automáticas
 * de mascotas utilizando inteligencia artificial, con manejo robusto de errores
 * y verificación de disponibilidad del servicio.
 *
 * Características:
 * - Generación automática de descripciones basadas en datos de mascota
 * - Verificación de salud del servicio de IA
 * - Manejo de estados de carga y errores
 * - Funciones memoizadas para optimización de rendimiento
 * - Integración con CSRF tokens para seguridad
 *
 * @author Equipo AdoptaFácil
 * @version 2.0.0 - Optimizado para producción
 * @since 2024
 */

import { useCallback, useState } from 'react';

/**
 * Interfaces TypeScript para tipado fuerte de datos
 */
interface MascotaParaDescripcion {
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    personalidad: string;
    salud: string;
    observaciones: string;
    descripcion_actual?: string;
}

interface DescripcionResponse {
    success: boolean;
    descripcion?: string;
    mensaje: string;
    error?: string;
}

/**
 * Hook principal con estado memoizado y funciones optimizadas
 */
export const useDescripcionIA = () => {
    /**
     * Estados del hook con tipado fuerte
     */
    const [generandoDescripcion, setGenerandoDescripcion] = useState(false);
    const [ultimaDescripcion, setUltimaDescripcion] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * Función memoizada para generar descripción automática
     * Optimizada con useCallback para evitar re-creaciones innecesarias
     * @param datosBasicos - Datos de la mascota para generar descripción
     * @returns Descripción generada o null en caso de error
     */
    const generarDescripcion = useCallback(async (datosBasicos: MascotaParaDescripcion): Promise<string | null> => {
        setGenerandoDescripcion(true);
        setError('');

        try {
            const response = await fetch('/api/descripciones/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(datosBasicos),
            });

            const data: DescripcionResponse = await response.json();

            if (data.success && data.descripcion) {
                setUltimaDescripcion(data.descripcion);
                return data.descripcion;
            } else {
                const errorMsg = data.error || data.mensaje || 'Error al generar descripción';
                setError(errorMsg);
                return null;
            }
        } catch (err) {
            const errorMsg = 'Error de conexión. Verifica que el microservicio esté activo.';
            setError(errorMsg);
            console.error('Error al generar descripción:', err);
            return null;
        } finally {
            setGenerandoDescripcion(false);
        }
    }, []);

    const verificarServicio = useCallback(async (): Promise<boolean> => {
        try {
            const response = await fetch('/api/descripciones/verificar-servicio');
            const data = await response.json();
            return data.success && data.servicio_activo;
        } catch (error) {
            console.error('Error al verificar servicio:', error);
            return false;
        }
    }, []);

    // Función específica para tu formulario de mascotas
    const generarDescripcionDesdeDatos = useCallback(
        (nombre: string, especie: string, raza: string, sexo: string, ciudad: string, descripcionActual: string) => {
            // Construir los datos necesarios para la IA
            const personalidad = descripcionActual || 'Mascota cariñosa y sociable';
            const salud = 'En excelente estado de salud'; // Puedes mejorar esto con más datos del formulario
            const observaciones = `${sexo === 'Macho' ? 'Es un' : 'Es una'} ${especie.toLowerCase()} ubicado en ${ciudad}`;

            return generarDescripcion({
                nombre,
                especie,
                raza: raza || 'Mestiza',
                sexo,
                personalidad,
                salud,
                observaciones,
                descripcion_actual: descripcionActual,
            });
        },
        [generarDescripcion],
    );

    const limpiarError = useCallback(() => setError(''), []);

    return {
        generandoDescripcion,
        ultimaDescripcion,
        error,
        generarDescripcion,
        generarDescripcionDesdeDatos,
        verificarServicio,
        limpiarError,
    };
};
