/**
 * Hook personalizado para generar descripciones de mascotas usando IA.
 * 
 * Este hook se integra con el microservicio FastAPI a través del backend Laravel
 * para generar descripciones emocionales y persuasivas de mascotas en adopción.
 * 
 * Funcionalidades:
 * - Generación de descripciones personalizadas
 * - Verificación del estado del servicio
 * - Manejo de errores y estados de carga
 * - Construcción automática de datos para la IA
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 */

import { useState } from "react";

// === Interfaces ===

/**
 * Estructura de datos requerida por el microservicio para generar descripciones
 */
interface MascotaParaDescripcion {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  personalidad: string;
  salud: string;
  observaciones: string;
  descripcion_actual?: string; // Descripción base opcional para mejorar
}

/**
 * Respuesta del endpoint de generación de descripciones
 */
interface DescripcionResponse {
  success: boolean;
  descripcion?: string;
  mensaje: string;
  error?: string;
  metadata?: {
    longitud: number;
    timestamp: string;
  };
}

/**
 * Respuesta del health check del servicio
 */
interface ServicioStatusResponse {
  success: boolean;
  servicio_activo: boolean;
  api_configurada?: boolean;
  proveedor_ia?: string;
  modelo?: string;
  apis_disponibles?: string[];
  mensaje: string;
  error?: string;
}

// === Hook Principal ===

export const useDescripcionIA = () => {
  // Estados del hook
  const [generandoDescripcion, setGenerandoDescripcion] = useState(false);
  const [ultimaDescripcion, setUltimaDescripcion] = useState<string>("");
  const [error, setError] = useState<string>("");

  /**
   * Obtiene el token CSRF para requests seguros
   */
  const obtenerCSRFToken = (): string => {
    const token = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    
    if (!token) {
      console.warn("Token CSRF no encontrado. Asegúrate de incluir @csrf en tu template Blade.");
    }
    
    return token || "";
  };

  /**
   * Genera una descripción usando el microservicio de IA
   * 
   * @param datosBasicos - Datos completos de la mascota
   * @returns Descripción generada o null si hay error
   */
  const generarDescripcion = async (
    datosBasicos: MascotaParaDescripcion
  ): Promise<string | null> => {
    setGenerandoDescripcion(true);
    setError("");

    try {
      // Validaciones básicas
      if (!datosBasicos.nombre?.trim()) {
        throw new Error("El nombre de la mascota es requerido");
      }
      
      if (!datosBasicos.especie?.trim()) {
        throw new Error("La especie de la mascota es requerida");
      }

      const response = await fetch("/api/descripciones/generar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": obtenerCSRFToken(),
        },
        body: JSON.stringify(datosBasicos),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: DescripcionResponse = await response.json();

      if (data.success && data.descripcion) {
        setUltimaDescripcion(data.descripcion);
        console.log("Descripción generada exitosamente:", {
          longitud: data.descripcion.length,
          metadata: data.metadata
        });
        return data.descripcion;
      } else {
        const errorMsg = data.error || data.mensaje || "Error al generar descripción";
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      let errorMsg = "Error de conexión. Verifica que el servicio esté activo.";
      
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      console.error("Error al generar descripción:", err);
      return null;
    } finally {
      setGenerandoDescripcion(false);
    }
  };

  /**
   * Verifica el estado del servicio de descripciones
   * 
   * @returns true si el servicio está disponible y configurado
   */
  const verificarServicio = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/descripciones/verificar-servicio", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(`Health check falló: ${response.status}`);
        return false;
      }

      const data: ServicioStatusResponse = await response.json();
      
      console.log("Estado del servicio:", {
        activo: data.servicio_activo,
        configurado: data.api_configurada,
        proveedor: data.proveedor_ia,
        modelo: data.modelo
      });

      return data.success && data.servicio_activo;
    } catch (error) {
      console.error("Error al verificar servicio:", error);
      return false;
    }
  };

  /**
   * Genera descripción de forma automática basada en datos del formulario
   * 
   * Construye los datos requeridos para la IA a partir de los campos
   * básicos del formulario de registro de mascotas.
   * 
   * @param nombre - Nombre de la mascota
   * @param especie - Especie (Perro, Gato, etc.)
   * @param raza - Raza de la mascota
   * @param sexo - Sexo de la mascota (Macho/Hembra)
   * @param ciudad - Ciudad donde se encuentra
   * @param descripcionActual - Descripción base a mejorar (opcional)
   * @returns Descripción generada o null si hay error
   */
  const generarDescripcionAutomatica = async (
    nombre: string,
    especie: string,
    raza: string,
    sexo: string,
    ciudad: string,
    descripcionActual?: string
  ): Promise<string | null> => {
    // Construcción inteligente de datos para la IA
    const personalidad = descripcionActual?.trim() || 
      "Mascota cariñosa y sociable que busca una familia amorosa";
    
    const salud = "En buen estado de salud, listo para adopción";
    
    const observaciones = `${
      sexo?.toLowerCase() === "macho" ? "Es un" : "Es una"
    } ${especie.toLowerCase()} ubicado en ${ciudad || "ubicación no especificada"}. ${
      raza ? `De raza ${raza}.` : "De raza mestiza."
    } Busca una familia que le brinde amor y cuidados.`;

    const datosCompletos: MascotaParaDescripcion = {
      nombre: nombre.trim(),
      especie: especie.trim(),
      raza: raza?.trim() || "Mestiza",
      sexo: sexo?.trim() || "No especificado",
      personalidad,
      salud,
      observaciones,
    };

    // Incluir descripción actual si existe para que la IA la mejore
    if (descripcionActual?.trim()) {
      datosCompletos.descripcion_actual = descripcionActual.trim();
    }

    return await generarDescripcion(datosCompletos);
  };

  /**
   * Limpia el error actual
   */
  const limpiarError = (): void => {
    setError("");
  };

  /**
   * Limpia todos los estados del hook
   */
  const resetear = (): void => {
    setGenerandoDescripcion(false);
    setUltimaDescripcion("");
    setError("");
  };

  // Return del hook con todas las funcionalidades
  return {
    // Estados
    generandoDescripcion,
    ultimaDescripcion,
    error,
    
    // Funciones principales
    generarDescripcion,
    generarDescripcionAutomatica,
    verificarServicio,
    
    // Utilidades
    limpiarError,
    resetear,
    
    // Estado computado
    hayDescripcion: ultimaDescripcion.length > 0,
    hayError: error.length > 0,
  };
};
