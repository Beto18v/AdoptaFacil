/**
 * GUÍA DE INTEGRACIÓN: Cómo agregar el generador de descripciones IA
 * al componente registrar-mascota.tsx
 */

/**
 * PASO 1: Importar el hook en registrar-mascota.tsx
 * Agregar esta línea al inicio del archivo, después de las otras importaciones:
 */
// import { useDescripcionIA } from './useDescripcionIA';

/**
 * PASO 2: Agregar el hook dentro del componente RegistrarMascota
 * Después de la línea: const [edadCalculada, setEdadCalculada] = useState<string>('');
 * Agregar:
 */
/*
const {
    generandoDescripcion,
    ultimaDescripcion,
    error: errorIA,
    generarDescripcionAutomatica,
    verificarServicio,
    limpiarError,
} = useDescripcionIA();

const [servicioIADisponible, setServicioIADisponible] = useState<boolean | null>(null);
*/

/**
 * PASO 3: Verificar servicio al abrir el modal
 * Dentro del useEffect que maneja la apertura del modal, agregar:
 */
/*
useEffect(() => {
    if (isOpen) {
        // ... código existente ...
        
        // Verificar servicio de IA
        verificarServicio().then(setServicioIADisponible);
    }
}, [isOpen, modoEdicion, mascotaEditar, reset, setData]);
*/

/**
 * PASO 4: Función para generar descripción
 * Agregar esta función antes del return del componente:
 */
/*
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
    
    const descripcionGenerada = await generarDescripcionAutomatica(
        data.nombre,
        data.especie,
        data.raza || 'Mestiza',
        data.sexo,
        data.ciudad || 'Ciudad no especificada',
        data.descripcion
    );

    if (descripcionGenerada) {
        setData('descripcion', descripcionGenerada);
    }
};
*/

/**
 * PASO 5: Botón para generar descripción IA
 * Agregar este botón DESPUÉS del textarea de descripción y ANTES del div de imágenes:
 */
/*
{servicioIADisponible && (
    <div className="flex items-center gap-3">
        <button
            type="button"
            onClick={handleGenerarDescripcionIA}
            disabled={generandoDescripcion || !data.nombre.trim() || !data.especie.trim()}
            className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {generandoDescripcion ? (
                <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generando descripción...
                </>
            ) : (
                <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Generar descripción con IA
                </>
            )}
        </button>
        
        <span className="text-xs text-gray-500">
            💡 La IA creará una descripción emocional para {data.nombre || 'la mascota'}
        </span>
    </div>
)}

{errorIA && (
    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
        <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorIA}
        </div>
    </div>
)}
*/

/**
 * UBICACIÓN EXACTA EN EL JSX:
 *
 * El botón debe ir después del textarea de descripción:
 *
 * <div>
 *     <textarea
 *         id="descripcion"
 *         name="descripcion"
 *         value={data.descripcion}
 *         onChange={(e) => setData('descripcion', e.target.value)}
 *         placeholder="Descripción y personalidad"
 *         rows={3}
 *         className="..."
 *     />
 *     {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
 *
 *     // ← AQUÍ VA EL CÓDIGO DEL BOTÓN IA
 *
 * </div>
 *
 * <div>  // ← Div de imágenes existente
 *     <label className="...">Imágenes de la mascota...</label>
 *     ...
 * </div>
 */

/**
 * PASO 6: Configurar rutas en Laravel
 *
 * 1. Copiar el controlador: laravel-integration/DescripcionMascotaController.php
 *    a: app/Http/Controllers/Api/DescripcionMascotaController.php
 *
 * 2. Agregar las rutas del archivo: laravel-integration/api-routes.php
 *    al archivo: routes/api.php
 *
 * 3. Agregar la configuración del archivo: laravel-integration/laravel-env.txt
 *    al archivo: .env de Laravel
 *
 * 4. Instalar Guzzle HTTP si no está instalado:
 *    composer require guzzlehttp/guzzle
 */

/**
 * PASO 7: Iniciar el microservicio
 *
 * 1. Abrir terminal en la carpeta faq-service
 * 2. Ejecutar: start.bat (Windows) o bash start.sh (Linux/Mac)
 * 3. Configurar DEEPSEEK_API_KEY en el archivo .env
 * 4. El servicio estará disponible en http://localhost:8001
 */

/**
 * RESULTADO ESPERADO:
 *
 * - Botón "Generar descripción con IA" aparecerá en el formulario
 * - Al hacer clic (después de llenar nombre y especie), generará una descripción emotiva
 * - La descripción se insertará automáticamente en el textarea
 * - El usuario puede editarla manualmente si desea
 */
