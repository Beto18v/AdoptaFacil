import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react'; // Se importa router
import { useState } from 'react';
import Logo from '../../../../public/Logo/Logo.png';
import LogoWhite from '../../../../public/Logo/LogoWhite.png';

import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

export default function Header() {
    const { props } = usePage<SharedData>();
    const auth = props.auth || { user: null };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scrolled = useScroll();

    const baseButtonClasses = 'rounded-lg px-4 py-2 font-medium transition-colors duration-300 ease-in-out';

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out',
                scrolled || isMenuOpen ? 'bg-white/95 shadow-md dark:bg-gray-800/95' : 'bg-black/20',
                'backdrop-blur-sm',
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href={route('index')} className="flex flex-shrink-0 items-center space-x-2">
                    <img src={scrolled || isMenuOpen ? Logo : LogoWhite} alt="Logo Adoptafácil" className="h-12 w-auto transition-all" />
                    <h1
                        className={cn(
                            'hidden font-bold transition-colors md:block',
                            scrolled || isMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-white',
                        )}
                    >
                        ADOPTAFÁCIL
                    </h1>
                </Link>

                <nav className="hidden space-x-6 md:flex">
                    <Link
                        href={route('productos')}
                        className={cn(
                            'font-medium transition-colors',
                            scrolled || isMenuOpen ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300' : 'text-white hover:text-gray-200',
                        )}
                    >
                        PRODUCTOS
                    </Link>
                    <Link
                        href="/mascotas"
                        className={cn(
                            'font-medium transition-colors',
                            scrolled || isMenuOpen ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300' : 'text-white hover:text-gray-200',
                        )}
                    >
                        MASCOTAS
                    </Link>
                    <Link
                        href={route('refugios')}
                        className={cn(
                            'font-medium transition-colors',
                            scrolled || isMenuOpen ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300' : 'text-white hover:text-gray-200',
                        )}
                    >
                        REFUGIOS
                    </Link>
                    <Link
                        href={route('comunidad')}
                        className={cn(
                            'font-medium transition-colors',
                            scrolled || isMenuOpen ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300' : 'text-white hover:text-gray-200',
                        )}
                    >
                        COMUNIDAD
                    </Link>
                </nav>

                <div className="flex items-center">
                    {/* --- BOTONES DE ESCRITORIO ACTUALIZADOS --- */}
                    <div className="hidden items-center space-x-2 md:flex">
                        {auth?.user ? (
                            <>
                                <Link href={route('dashboard')} className={cn(baseButtonClasses, 'bg-blue-600 text-white hover:bg-blue-700')}>
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className={cn(baseButtonClasses, 'bg-red-600 text-white hover:bg-red-700')}>
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className={cn(
                                        baseButtonClasses,
                                        'bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-blue-600/70 dark:text-blue-200 dark:hover:bg-blue-600',
                                    )}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={route('register.options')}
                                    className={cn(
                                        baseButtonClasses,
                                        'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-600/70 dark:text-green-200 dark:hover:bg-green-600',
                                    )}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                    {/* --- FIN BOTONES ESCRITORIO --- */}

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className={cn(
                                'inline-flex items-center justify-center rounded-md p-2 transition-colors',
                                scrolled || isMenuOpen ? 'text-gray-700 dark:text-gray-300' : 'text-white',
                            )}
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            <svg className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            <svg className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MENÚ MÓVIL ACTUALIZADO --- */}
            <div className={cn('md:hidden', isMenuOpen ? 'block' : 'hidden')} id="mobile-menu">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    <Link
                        href={route('productos')}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        PRODUCTOS
                    </Link>
                    <Link
                        href="/mascotas"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        MASCOTAS
                    </Link>
                    <Link
                        href={route('refugios')}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        REFUGIOS
                    </Link>
                    <Link
                        href={route('comunidad')}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        COMUNIDAD
                    </Link>

                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-600">
                        {auth?.user ? (
                            <div className="space-y-2">
                                <Link
                                    href={route('dashboard')}
                                    className="block w-full rounded-md bg-blue-200 px-3 py-2 text-center text-base font-medium text-blue-800 hover:bg-blue-300 dark:bg-blue-600/70 dark:text-blue-200 dark:hover:bg-blue-600"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full rounded-md bg-red-200 px-3 py-2 text-center text-base font-medium text-red-800 hover:bg-red-300 dark:bg-red-600/70 dark:text-red-200 dark:hover:bg-red-600"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href={route('login')}
                                    className="block w-full rounded-md bg-blue-200 px-3 py-2 text-center text-base font-medium text-blue-800 hover:bg-blue-300 dark:bg-blue-600/70 dark:text-blue-200 dark:hover:bg-blue-600"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={route('register.options')}
                                    className="block w-full rounded-md bg-green-200 px-3 py-2 text-center text-base font-medium text-green-800 hover:bg-green-300 dark:bg-green-600/70 dark:text-green-200 dark:hover:bg-green-600"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
