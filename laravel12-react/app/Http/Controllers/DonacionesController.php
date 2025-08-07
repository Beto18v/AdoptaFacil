<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DonacionesController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->load('shelter'); // Cargamos la relación del refugio

        $donationsQuery = Donation::with('shelter')->orderBy('created_at', 'desc');

        if ($user->role === 'aliado') {
            if ($user->shelter) {
                $donationsQuery->where('shelter_id', $user->shelter->id);
            } else {
                $donationsQuery->where('shelter_id', -1);
            }
        } elseif ($user->role === 'cliente') {
            $donationsQuery->where('donor_email', $user->email);
        }

        return Inertia::render('Dashboard/Donaciones/index', [
            'donations' => $donationsQuery->get(),
            'shelters' => Shelter::all(['id', 'name']),
            // No es necesario pasar 'auth' de nuevo, HandleInertiaRequests ya lo hace.
            // Nos aseguramos que la info del refugio del usuario esté actualizada.
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'required|email|max:255',
            'amount' => 'required|numeric|min:1000',
            'shelter_id' => 'required|exists:shelters,id',
        ]);

        Donation::create($validatedData);

        return redirect()->back()->with('success', '¡Donación registrada exitosamente!');
    }
}
