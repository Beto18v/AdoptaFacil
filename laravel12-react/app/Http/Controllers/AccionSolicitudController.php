<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Solicitud;

/**
 * AccionSolicitudController - Gestión de solicitudes de adopción y compra
 * 
 * Este controlador maneja la creación de nuevas solicitudes de usuarios
 * para adoptar mascotas o comprar productos en la plataforma.
 * 
 * Funcionalidades:
 * - Registro de solicitudes de adopción de mascotas
 * - Registro de solicitudes de compra de productos
 * - Validación de datos de entrada
 * - Vinculación automática con usuario autenticado
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 */
class AccionSolicitudController extends Controller
{
    /**
     * Crear nueva solicitud de adopción o compra
     * 
     * Procesa solicitudes de usuarios para adoptar mascotas o comprar productos.
     * La solicitud se crea en estado "En proceso" y queda pendiente de revisión
     * por parte del propietario del elemento.
     * 
     * @param Request $request Datos de la solicitud (tipo, item_id)
     * @return \Illuminate\Http\RedirectResponse Redirección con mensaje de éxito
     */
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
