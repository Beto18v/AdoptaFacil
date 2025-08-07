/**
 * Componente para generar descripciones de mascotas con IA.
 * 
 * Este componente se integra con el formulario de registro de mascotas
 * y permite generar descripciones emocionales y persuasivas usando
 * el microservicio de IA a través del backend Laravel.
 * 
 * Características:
 * - Validación de datos antes de generar
 * - Preview en tiempo real de descripciones
 * - Manejo de estados de carga y errores
 * - Verificación automática del servicio
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useDescripcionIA } from './useDescripcionIA';

// === Interfaces ===

interface GeneradorDescripcionProps {
    // Datos de la mascota desde el formulario padre
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    ciudad: string;
    descripcionActual: string;
    
    // Callback para actualizar la descripción en el formulario padre
    onDescripcionGenerada: (descripcion: string) => void;
    
    // Props opcionales para personalización
    className?: string;
    mostrarPreview?: boolean;
    disabled?: boolean;
}

// === Componente Principal ===

export const GeneradorDescripcion: React.FC<GeneradorDescripcionProps> = ({
    nombre,
    especie,
    raza,
    sexo,
    ciudad,
    descripcionActual,
    onDescripcionGenerada,
    className = '',
    mostrarPreview = true,
    disabled = false,
}) => {
    // Hook personalizado para manejar la IA
    const {
        generandoDescripcion,
        ultimaDescripcion,
        error,
        generarDescripcionAutomatica,
        verificarServicio,
        limpiarError,
        hayDescripcion,
        hayError,
    } = useDescripcionIA();

    // Estados locales del componente
    const [servicioDisponible, setServicioDisponible] = useState<boolean | null>(null);
    const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState(false);
    const [verificandoServicio, setVerificandoServicio] = useState(true);

    /**
     * Verificar disponibilidad del servicio al montar el componente
     */
    useEffect(() => {
        const checkServicio = async () => {
            setVerificandoServicio(true);
            try {
                const disponible = await verificarServicio();
                setServicioDisponible(disponible);
            } catch (error) {
                console.error('Error verificando servicio:', error);
                setServicioDisponible(false);
            } finally {
                setVerificandoServicio(false);
            }
        };

        checkServicio();
    }, [verificarServicio]);

    /**
     * Valida los datos requeridos antes de generar la descripción
     */
    const validarDatos = (): string | null => {
        if (!nombre?.trim()) {
            return 'Por favor, ingresa el nombre de la mascota antes de generar la descripción';
        }
        
        if (!especie?.trim()) {
            return 'Por favor, selecciona la especie antes de generar la descripción';
        }

        if (!sexo?.trim()) {
            return 'Por favor, especifica el sexo de la mascota';
        }

        return null;
    };

    /**
     * Maneja la generación de descripción con validaciones
     */
    const handleGenerarDescripcion = async (): Promise<void> => {
        // Limpiar errores previos
        limpiarError();
        
        // Validar datos
        const errorValidacion = validarDatos();
        if (errorValidacion) {
            alert(errorValidacion);
            return;
        }

        try {
            const descripcionGenerada = await generarDescripcionAutomatica(
                nombre,
                especie,
                raza || 'Mestiza',
                sexo,
                ciudad || 'Ciudad no especificada',
                descripcionActual
            );

            if (descripcionGenerada) {
                onDescripcionGenerada(descripcionGenerada);
                setMostrarDescripcionCompleta(true);
            }
        } catch (error) {
            console.error('Error generando descripción:', error);
        }
    };

    /**
     * Aplica la descripción generada al formulario
     */
    const aplicarDescripcion = (): void => {
        if (ultimaDescripcion) {
            onDescripcionGenerada(ultimaDescripcion);
            setMostrarDescripcionCompleta(false);
        }
    };

    /**
     * Descarta la descripción generada
     */
    const descartarDescripcion = (): void => {
        setMostrarDescripcionCompleta(false);
    };

    /**
     * Reintentar verificación del servicio
     */
    const reintentarVerificacion = async (): Promise<void> => {
        setVerificandoServicio(true);
        const disponible = await verificarServicio();
        setServicioDisponible(disponible);
        setVerificandoServicio(false);
    };

    // === Renderizado Condicional ===

    // Mostrar estado de carga inicial
    if (verificandoServicio) {
        return (
            <div className={`generador-descripcion ${className}`}>
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-600">Verificando servicio de IA...</span>
                </div>
            </div>
        );
    }

    // No mostrar si el servicio no está disponible
    if (servicioDisponible === false) {
        return (
            <div className={`generador-descripcion ${className}`}>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-red-800 font-medium">Servicio de IA no disponible</h4>
                            <p className="text-red-600 text-sm">
                                El generador de descripciones automáticas no está disponible en este momento.
                            </p>
                        </div>
                        <button
                            onClick={reintentarVerificacion}
                            className="text-red-600 hover:text-red-800 font-medium text-sm underline"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // === Renderizado Principal ===

    return (
        <div className={`generador-descripcion space-y-4 ${className}`}>
            {/* Botón principal de generación */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={handleGenerarDescripcion}
                    disabled={disabled || generandoDescripcion || !servicioDisponible}
                    className={`
                        px-4 py-2 rounded-lg font-medium transition-colors duration-200
                        ${disabled || generandoDescripcion || !servicioDisponible
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }
                    `}
                >
                    {generandoDescripcion ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generando descripción...
                        </span>
                    ) : (
                        '✨ Generar descripción con IA'
                    )}
                </button>

                <div className="text-sm text-gray-500">
                    {servicioDisponible && (
                        <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Servicio disponible
                        </span>
                    )}
                </div>
            </div>

            {/* Mostrar errores */}
            {hayError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-red-600 text-sm">{error}</span>
                        <button
                            onClick={limpiarError}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Preview de la descripción generada */}
            {mostrarPreview && hayDescripcion && mostrarDescripcionCompleta && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-green-800 font-medium mb-2">
                        📝 Descripción generada para {nombre}
                    </h4>
                    <div className="bg-white p-3 rounded border text-gray-700 mb-3">
                        "{ultimaDescripcion}"
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={aplicarDescripcion}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                            ✓ Usar esta descripción
                        </button>
                        <button
                            onClick={descartarDescripcion}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                            ✕ Descartar
                        </button>
                    </div>
                </div>
            )}

            {/* Ayuda contextual */}
            <div className="text-xs text-gray-500">
                💡 La IA generará una descripción emocional basada en los datos ingresados.
                {descripcionActual && (
                    <span className="block mt-1">
                        Mejorará la descripción actual que escribiste.
                    </span>
                )}
            </div>
        </div>
    );
};

    
