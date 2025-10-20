<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Acceso denegado');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:cliente,aliado,admin',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

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
