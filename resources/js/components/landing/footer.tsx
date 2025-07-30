import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-gray-800 py-10 text-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-xl font-bold">ADOPTAFÁCIL</h3>
                        <p className="text-gray-400">Conectando mascotas con hogares amorosos desde 2023.</p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Enlaces útiles</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/como-adoptar" className="text-gray-400 transition hover:text-white">
                                    Cómo adoptar
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 transition hover:text-white">
                                    Preguntas frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 transition hover:text-white">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Contacto</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">info@adoptafacil.com</li>
                            <li className="text-gray-400">+1 234 567 890</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Síguenos</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 transition hover:text-white">
                                FB
                            </Link>
                            <Link href="#" className="text-gray-400 transition hover:text-white">
                                IG
                            </Link>
                            <Link href="#" className="text-gray-400 transition hover:text-white">
                                TW
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>© 2023 Adoptafácil. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
