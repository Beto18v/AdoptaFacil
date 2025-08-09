<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ProfileController - Controlador de configuración de perfil de usuario
 * 
 * Este controlador maneja la gestión del perfil personal del usuario:
 * - Vista de configuración de perfil con datos actuales
 * - Actualización de información personal (nombre, email, etc.)
 * - Manejo de verificación de email cuando se cambia
 * - Validación de datos mediante Form Request personalizado
 * - Feedback de estado de operaciones
 * 
 * Funcionalidades principales:
 * - Edición de datos personales del usuario
 * - Validación específica para cambios de email
 * - Manejo de usuarios que requieren verificación de email
 * - Actualización segura con validación de permisos
 * - Integración con sistema de notificaciones de estado
 * - Soporte para redirecciones con mensajes de confirmación
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 * @since 2024
 * @package App\Http\Controllers\Settings
 */

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
