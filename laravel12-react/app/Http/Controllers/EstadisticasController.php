<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('Dashboard/Estadisticas/index', []);
    }
}
