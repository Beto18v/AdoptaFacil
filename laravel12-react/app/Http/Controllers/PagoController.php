<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Solicitud;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

/**
 * PagoController - Controlador del módulo de procesamiento de pagos
 * 
 * Este controlador maneja toda la integración con pasarelas de pago en AdoptaFácil:
 * - Procesamiento de pagos para productos del marketplace
 * - Integración con MercadoPago para transacciones seguras
 * - Cálculo de comisiones y descuentos automáticos
 * - Manejo de callbacks y confirmaciones de pago
 * - Gestión de estados de transacciones
 * 
 * Funcionalidades principales:
 * - Inicialización de procesos de pago con MercadoPago
 * - Cálculo automático de comisiones (15% para la plataforma)
 * - Configuración de URLs de retorno (éxito/error)
 * - Procesamiento de webhooks de confirmación
 * - Actualización de estados de solicitudes post-pago
 * - Integración con sistema de productos y solicitudes
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 * @since 2024
 * @package App\Http\Controllers
 */

class PagoController extends Controller
{
    public function iniciarPago(Request $request)
    {
        $producto = Product::findOrFail($request->producto_id);
        $cuota = $producto->precio * 0.15;
        $total = $producto->precio - $cuota;

        SDK::setAccessToken(env('MERCADOPAGO_TOKEN'));

        $item = new Item();
        $item->title = $producto->nombre;
        $item->quantity = 1;
        $item->unit_price = (float) $total;

        $preference = new Preference();
        $preference->items = [$item];
        $preference->back_urls = [
            "success" => url('/pagos/exito'),
            "failure" => url('/pagos/fallo'),
            "pending" => url('/pagos/pendiente'),
        ];
        $preference->auto_return = "approved";
        $preference->external_reference = auth()->id() . '|' . $producto->id;
        $preference->notification_url = url('/pagos/webhook');

        $preference->save();

        return response()->json(['url' => $preference->init_point]);
    }

    public function webhook(Request $request)
    {
        $data = $request->all();
        if (($data['type'] ?? null) === 'payment') {
            $payment = file_get_contents("https://api.mercadopago.com/v1/payments/{$data['data']['id']}?access_token=" . env('MERCADOPAGO_TOKEN'));
            $payment = json_decode($payment, true);

            if ($payment['status'] === 'approved') {
                [$user_id, $producto_id] = explode('|', $payment['external_reference']);
                Solicitud::firstOrCreate([
                    'user_id' => $user_id,
                    'tipo' => 'compra',
                    'item_id' => $producto_id,
                ], [
                    'estado' => 'En proceso',
                ]);
                // Aquí puedes crear la notificación para el aliado
            }
        }
        return response()->json(['status' => 'ok']);
    }
}
