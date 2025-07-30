<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Solicitud;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

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
