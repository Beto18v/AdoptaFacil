<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * Controlador para la integración con el microservicio de descripciones de mascotas.
 * 
 * Este controlador se encarga de comunicarse con el servicio externo de IA
 * para generar descripciones emocionales de mascotas en adopción.
 * 
 * @package App\Http\Controllers\Api
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 */
class DescripcionMascotaController extends Controller
{
    /**
     * URL del microservicio de descripciones
     * @var string
     */
    private $faqServiceUrl;

    /**
     * Cliente HTTP para comunicación con el microservicio
     * @var Client
     */
    private $client;

    /**
     * Constructor del controlador.
     * 
     * Inicializa la configuración del cliente HTTP y la URL del servicio.
     */
    public function __construct()
    {
        $this->faqServiceUrl = env('FAQ_SERVICE_URL', 'http://localhost:8001');
        $this->client = new Client([
            'timeout' => 30,        // Timeout para requests (30 segundos)
            'connect_timeout' => 10, // Timeout de conexión (10 segundos)
            'verify' => false,       // Desactivar verificación SSL en desarrollo
        ]);
    }

    /**
     * Genera una descripción emocional para una mascota usando IA.
     * 
     * Valida los datos de entrada, los envía al microservicio de IA
     * y retorna la descripción generada o un error apropiado.
     * 
     * @param Request $request Datos de la mascota
     * @return JsonResponse Respuesta JSON con la descripción o error
     * 
     * @throws ValidationException Si los datos no pasan la validación
     */
    public function generarDescripcion(Request $request): JsonResponse
    {
        // Validación de datos de entrada
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255|min:1',
            'especie' => 'required|string|max:100|min:1',
            'raza' => 'required|string|max:100|min:1',
            'sexo' => 'required|string|in:Macho,Hembra,macho,hembra,M,F,m,f',
            'personalidad' => 'required|string|max:500|min:1',
            'salud' => 'required|string|max:500|min:1',
            'observaciones' => 'required|string|max:500',
            'descripcion_actual' => 'nullable|string|max:1000', // Descripción base opcional
        ]);

        try {
            Log::info('Iniciando generación de descripción para mascota', [
                'nombre' => $validatedData['nombre'],
                'especie' => $validatedData['especie'],
                'raza' => $validatedData['raza'],
                'sexo' => $validatedData['sexo']
            ]);

            // Preparar datos para el microservicio
            $payload = [
                'nombre' => $validatedData['nombre'],
                'especie' => $validatedData['especie'],
                'raza' => $validatedData['raza'],
                'sexo' => $validatedData['sexo'],
                'personalidad' => $validatedData['personalidad'],
                'salud' => $validatedData['salud'],
                'observaciones' => $validatedData['observaciones'],
            ];

            // Agregar descripción actual si existe
            if (!empty($validatedData['descripcion_actual'])) {
                $payload['descripcion_actual'] = $validatedData['descripcion_actual'];
            }

            // Enviar request al microservicio
            $response = $this->client->post($this->faqServiceUrl . '/generar-descripcion', [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            // Validar respuesta del microservicio
            if (!isset($data['descripcion']) || empty($data['descripcion'])) {
                throw new \Exception('Respuesta inválida del servicio de IA');
            }

            Log::info('Descripción generada exitosamente', [
                'descripcion_length' => strlen($data['descripcion']),
                'mascota' => $validatedData['nombre']
            ]);

            return response()->json([
                'success' => true,
                'descripcion' => $data['descripcion'],
                'mensaje' => 'Descripción generada exitosamente',
                'metadata' => [
                    'longitud' => strlen($data['descripcion']),
                    'timestamp' => now()->toISOString()
                ]
            ], 200);
        } catch (ConnectException $e) {
            Log::error('Error de conexión con el servicio de descripciones', [
                'error' => $e->getMessage(),
                'url' => $this->faqServiceUrl
            ]);

            return response()->json([
                'success' => false,
                'mensaje' => 'Servicio de descripciones no disponible. Intenta más tarde.',
                'error' => 'Conexión rechazada'
            ], 503);
        } catch (RequestException $e) {
            $statusCode = $e->getResponse() ? $e->getResponse()->getStatusCode() : 500;
            $responseBody = $e->getResponse() ? $e->getResponse()->getBody()->getContents() : '';

            Log::error('Error HTTP en servicio de descripciones', [
                'status_code' => $statusCode,
                'response_body' => $responseBody,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'mensaje' => 'Error al generar descripción. Revisa los datos e intenta nuevamente.',
                'error' => 'Servicio de IA reportó error',
                'details' => $statusCode >= 400 && $statusCode < 500 ? 'Datos inválidos' : 'Error interno del servicio'
            ], $statusCode >= 500 ? 503 : 422);
        } catch (\Exception $e) {
            Log::error('Error inesperado al generar descripción', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'mensaje' => 'Error interno del servidor',
                'error' => 'Error inesperado'
            ], 500);
        }
    }

    /**
     * Verifica el estado del servicio de descripciones.
     * 
     * Realiza un health check del microservicio para verificar
     * que esté funcionando correctamente.
     * 
     * @return JsonResponse Estado del servicio
     */
    public function verificarServicio(): JsonResponse
    {
        try {
            Log::info('Verificando estado del servicio de descripciones');

            $response = $this->client->get($this->faqServiceUrl . '/health', [
                'timeout' => 5 // Timeout más corto para health check
            ]);

            $data = json_decode($response->getBody(), true);

            return response()->json([
                'success' => true,
                'servicio_activo' => true,
                'api_configurada' => $data['api_configured'] ?? false,
                'proveedor_ia' => $data['api_provider'] ?? 'desconocido',
                'modelo' => $data['model'] ?? 'desconocido',
                'apis_disponibles' => $data['available_apis'] ?? [],
                'mensaje' => 'Servicio de descripciones disponible',
                'timestamp' => now()->toISOString()
            ], 200);
        } catch (ConnectException $e) {
            Log::warning('Servicio de descripciones no disponible', [
                'error' => $e->getMessage(),
                'url' => $this->faqServiceUrl
            ]);

            return response()->json([
                'success' => false,
                'servicio_activo' => false,
                'mensaje' => 'Servicio de descripciones no disponible',
                'error' => 'Conexión rechazada',
                'timestamp' => now()->toISOString()
            ], 503);
        } catch (RequestException $e) {
            Log::error('Error HTTP en health check', [
                'status_code' => $e->getResponse() ? $e->getResponse()->getStatusCode() : 'unknown',
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'servicio_activo' => false,
                'mensaje' => 'Servicio de descripciones reportó error',
                'error' => 'Error en health check',
                'timestamp' => now()->toISOString()
            ], 503);
        } catch (\Exception $e) {
            Log::error('Error inesperado en health check', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'servicio_activo' => false,
                'mensaje' => 'Error al verificar servicio',
                'error' => 'Error inesperado',
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }
}
