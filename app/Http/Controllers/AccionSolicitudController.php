<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Solicitud;

class AccionSolicitudController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:adopcion,compra',
            'item_id' => 'required|integer',
        ]);

        $solicitud = Solicitud::create([
            'user_id' => Auth::id(),
            'tipo' => $request->tipo,
            'item_id' => $request->item_id,
            'estado' => 'En proceso',
        ]);

        // Aquí puedes disparar la notificación si tienes lógica implementada
        // Notification::send(...)

        // Redirige a la página de solicitudes con mensaje flash para Inertia
        return redirect()->route('solicitudes.index')->with('success', 'Solicitud registrada correctamente.');
    }
}
