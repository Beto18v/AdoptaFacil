<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EstadisticasController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Estadisticas/index', []);
    }
}
