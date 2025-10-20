<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GestionUsuariosController extends Controller
{
    public function index()
    {
        // Verificar que sea admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Acceso denegado');
        }

        // Obtener todos los usuarios
        $usuarios = User::all();

        return Inertia::render('Dashboard/GestionUsuarios/index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        // Debug: verificar usuario autenticado
        $currentUser = auth()->user();
        Log::info('Usuario actual intentando crear usuario:', [
            'user_id' => $currentUser ? $currentUser->id : null,
            'user_role' => $currentUser ? $currentUser->role : null,
            'request_data' => $request->all()
        ]);

        if (!$currentUser || $currentUser->role !== 'admin') {
            Log::warning('Acceso denegado: usuario no es admin', [
                'user_id' => $currentUser ? $currentUser->id : null,
                'user_role' => $currentUser ? $currentUser->role : null
            ]);
            abort(403, 'Acceso denegado');
        }

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:cliente,aliado,admin',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación:', $e->errors());
            throw $e;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        Log::info('Usuario creado exitosamente:', ['user_id' => $user->id, 'email' => $user->email]);

        // Enviar email de bienvenida al microservicio
        try {
            $response = Http::timeout(5)->post('http://localhost:8080/api/send-welcome-email', [
                'email' => $user->email,
                'name' => $user->name,
            ]);

            if ($response->successful()) {
                Log::info('Email enviado exitosamente para usuario:', ['user_id' => $user->id]);
            } else {
                Log::warning('Error en respuesta del microservicio:', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error enviando email de bienvenida: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Usuario creado exitosamente');
    }

    public function update(Request $request, User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Acceso denegado');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:cliente,aliado,admin',
        ]);

        $user->update($request->only(['name', 'email', 'role']));

        return redirect()->back()->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Acceso denegado');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado exitosamente');
    }

    public function sendBulkEmail(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Acceso denegado');
        }

        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $users = User::whereIn('id', $request->user_ids)->get();

        // Aquí integrar con el microservicio de correo
        // Por ejemplo, llamar a una API del mail-service

        // Simulación
        foreach ($users as $user) {
            // Enviar email
        }

        return redirect()->back()->with('success', 'Correos enviados exitosamente');
    }
}
