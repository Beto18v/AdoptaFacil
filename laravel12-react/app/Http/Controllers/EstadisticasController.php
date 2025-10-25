<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Solicitud;
use App\Models\Mascota;
use Carbon\Carbon;

/**
 * EstadisticasController - Controlador del módulo de estadísticas avanzadas
 * 
 * Este controlador maneja funcionalidades de estadísticas específicas y avanzadas:
 * - Dashboard especializado de estadísticas detalladas
 * - Métricas granulares por módulo específico
 * - Reportes personalizados según parámetros de usuario
 * - Análisis de tendencias y patrones de uso
 * - Exportación de datos estadísticos
 * 
 * Funcionalidades principales:
 * - Vista especializada de estadísticas avanzadas
 * - Integración con sistema de analytics principal
 * - Filtros temporales y por categorías
 * - Generación de reportes personalizados
 * - API para consumo de datos estadísticos
 * - Métricas de performance y uso del sistema
 * 
 * @author Equipo AdoptaFácil
 * @version 1.0.0
 * @since 2024
 * @package App\Http\Controllers
 */

class EstadisticasController extends Controller
{
    public function index()
    {
        // Estadísticas generales
        $totalAdoptions = Solicitud::where('estado', 'Aprobada')->count();
        $pendingRequests = Solicitud::whereIn('estado', ['Enviada', 'En Proceso'])->count();
        $totalRequests = Solicitud::count();
        $successRate = $totalRequests > 0 ? round(($totalAdoptions / $totalRequests) * 100, 2) : 0;

        // Promedio mensual (últimos 12 meses)
        $startDate = Carbon::now()->subMonths(12);
        $monthlyAdoptions = Solicitud::where('estado', 'Aprobada')
            ->where('created_at', '>=', $startDate)
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $averageMonthly = $monthlyAdoptions->avg('count') ?? 0;

        // Estadísticas mensuales (últimos 3 meses)
        $monthlyStats = [];
        for ($i = 2; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->locale('es')->monthName;
            $year = $date->year;
            $month = $date->month;

            $adoptions = Solicitud::where('estado', 'Aprobada')
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count();

            $returns = Solicitud::where('estado', 'Rechazada')
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count();

            $totalMonth = $adoptions + $returns;
            $success = $totalMonth > 0 ? round(($adoptions / $totalMonth) * 100, 2) : 0;

            $monthlyStats[] = [
                'month' => ucfirst($monthName),
                'adoptions' => $adoptions,
                'returns' => $returns,
                'success' => $success,
            ];
        }

        // Datos para el gráfico
        $adopcionesPorMes = array_map(function ($stat) {
            return ['mes' => $stat['month'], 'adopciones' => $stat['adoptions']];
        }, $monthlyStats);

        // Distribución por especie (de mascotas adoptadas)
        $adoptedPetIds = Solicitud::where('estado', 'Aprobada')->pluck('mascota_id');
        $speciesDistribution = Mascota::whereIn('id', $adoptedPetIds)
            ->selectRaw('especie, COUNT(*) as count')
            ->groupBy('especie')
            ->get();

        $totalAdoptedPets = $speciesDistribution->sum('count');
        $distribucionTipos = $speciesDistribution->map(function ($item) use ($totalAdoptedPets) {
            $percentage = $totalAdoptedPets > 0 ? round(($item->count / $totalAdoptedPets) * 100, 1) : 0;
            return [
                'name' => ucfirst($item->especie),
                'value' => $percentage,
                'total' => $item->count,
            ];
        })->toArray();

        return Inertia::render('Dashboard/Estadisticas/index', [
            'generalStats' => [
                'totalAdoptions' => $totalAdoptions,
                'averageMonthly' => round($averageMonthly, 1),
                'successRate' => $successRate,
                'pendingRequests' => $pendingRequests,
            ],
            'monthlyStats' => $monthlyStats,
            'adopcionesPorMes' => $adopcionesPorMes,
            'distribucionTipos' => $distribucionTipos,
        ]);
    }
}
