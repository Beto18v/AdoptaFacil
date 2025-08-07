import { ThemeSwitcher } from '@/components/theme-switcher';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Logo from '../../../../public/Logo/Logo.png';

export default function RegistroOpciones() {
    const [tarjetaActiva, setTarjetaActiva] = useState<number | null>(null);

    useEffect(() => {
        document.title = 'Opciones de Registro | AdoptaFácil';
    }, []);

    const opcionesRegistro = [
        {
            id: 1,
            titulo: 'Amigo AdoptaFácil',
            descripcion: 'Adopta, publica mascotas o apoya con recursos. Forma parte activa del bienestar animal.',
            icono: '🐾',
            color: 'from-blue-500 to-blue-700',
            rol: 'cliente',
        },
        {
            id: 2,
            titulo: 'Aliado AdoptaFácil',
            descripcion: 'Regístrate como refugio, veterinaria o tienda. Conecta tu servicio con quienes más lo necesitan.',
            icono: '🏢',
            color: 'from-green-500 to-green-700',
            rol: 'aliado',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white dark:from-green-600 dark:to-blue-700">
            <Head title="Opciones de Registro" />
            {/* Header con logo */}
            <div className="pt-10 text-center">
                <Link href={route('index')}>
                    <img src={Logo} alt="Logo" className="mx-auto mb-8 h-36 w-56" />
                </Link>
                <h1 className="mt-4 text-3xl font-bold md:text-4xl">Únete a AdoptaFácil</h1>
                <p className="mx-auto mt-2 max-w-xl px-4 text-white/90">
                    Selecciona el tipo de cuenta que deseas crear y comienza tu experiencia con nosotros
                </p>
            </div>

            {/* Tarjetas de opciones */}
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 px-4 md:grid-cols-2">
                {opcionesRegistro.map((opcion) => (
                    <div
                        key={opcion.id}
                        onMouseEnter={() => setTarjetaActiva(opcion.id)}
                        onMouseLeave={() => setTarjetaActiva(null)}
                        className={`rounded-2xl bg-white p-6 text-gray-800 shadow-lg transition-transform duration-300 hover:shadow-2xl dark:bg-gray-700 dark:text-white ${
                            tarjetaActiva === opcion.id ? 'scale-105 ring-2 ring-white' : ''
                        }`}
                    >
                        <div
                            className={`bg-gradient-to-r ${opcion.color} mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-md`}
                        >
                            {opcion.icono}
                        </div>
                        <h3 className="mb-2 text-center text-xl font-semibold">{opcion.titulo}</h3>
                        <p className="mb-6 text-center text-gray-700 dark:text-white">{opcion.descripcion}</p>
                        <Link
                            href={route('register', { role: opcion.rol })}
                            className="block w-full rounded-xl bg-blue-600 py-3 text-center text-white transition-colors duration-300 hover:bg-blue-700"
                        >
                            Registrarme
                        </Link>
                    </div>
                ))}
            </div>

            {/* Informativo */}
            <section className="mt-16 rounded-t-3xl bg-white px-6 py-10 text-gray-800 md:px-20 dark:bg-gray-700 dark:text-white">
                <h2 className="mb-6 text-center text-2xl font-bold">¿Por qué registrarte en AdoptaFácil?</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-gray-100 p-6 dark:bg-gray-900 dark:text-white">
                        <h3 className="mb-2 text-lg font-semibold">Proceso simplificado</h3>
                        <p>Desde la búsqueda hasta el seguimiento, todo está pensado para facilitar la adopción.</p>
                    </div>
                    <div className="rounded-xl bg-gray-100 p-6 dark:bg-gray-900 dark:text-white">
                        <h3 className="mb-2 text-lg font-semibold">Comunidad comprometida</h3>
                        <p>Únete a quienes realmente aman y protegen a los animales.</p>
                    </div>
                    <div className="rounded-xl bg-gray-100 p-6 dark:bg-gray-900 dark:text-white">
                        <h3 className="mb-2 text-lg font-semibold">Recursos exclusivos</h3>
                        <p>Accede a beneficios según tu tipo de cuenta.</p>
                    </div>
                </div>

                <div className="mt-12 space-y-6">
                    <h2 className="text-center text-2xl font-bold">Preguntas frecuentes</h2>

                    <div className="border-b border-gray-300 pb-4">
                        <h3 className="text-lg font-semibold">¿Es gratuito el registro?</h3>
                        <p className="mt-2">Sí, el registro es completamente gratuito para todas las opciones de cuenta.</p>
                    </div>

                    <div className="border-b border-gray-300 pb-4">
                        <h3 className="text-lg font-semibold">¿Puedo cambiar mi tipo de cuenta después?</h3>
                        <p className="mt-2">Claro. Solo necesitas completar alguna información adicional.</p>
                    </div>

                    <div className="border-b border-gray-300 pb-4">
                        <h3 className="text-lg font-semibold">¿Qué documentos necesito?</h3>
                        <p className="mt-2">Depende del tipo de cuenta. Fundaciones deben adjuntar soporte legal.</p>
                    </div>
                </div>
            </section>
            <ThemeSwitcher />
        </div>
    );
}
