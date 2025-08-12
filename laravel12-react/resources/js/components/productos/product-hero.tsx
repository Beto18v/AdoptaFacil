/**
 * Componente Hero optimizado para la página de productos
 *
 * Proporciona una introducción visual atractiva al catálogo de productos
 * del marketplace de AdoptaFácil con diseño responsive y accesible.
 *
 * @author Equipo AdoptaFácil
 * @version 2.0.0 - Corregido y optimizado
 */
export default function ProductHero() {
    return (
        <section className="relative bg-gradient-to-r from-green-400 to-blue-500 py-20 pt-35 dark:from-green-600 dark:to-blue-700">
            {/* Contenido de texto centrado y optimizado */}
            <div className="relative container mx-auto px-4 text-center text-white">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Explora productos</h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
                    Descubre artículos para mascotas, desde alimento y juguetes hasta accesorios y servicios veterinarios, todo en un solo clic.
                </p>
            </div>
        </section>
    );
}
