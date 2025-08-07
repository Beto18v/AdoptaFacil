import { ArrowRight, Heart, Star } from 'lucide-react';
import PetCard from './pet-card';

// Definimos la interfaz para el array de mascotas
interface Pet {
    name: string;
    breed: string;
    age: string;
    description: string;
    imageUrl: string;
}

export default function PetsSection({ pets }: { pets: Pet[] }) {
    return (
        <section className="relative bg-white py-20 dark:bg-gray-900">
            {/* Elementos decorativos */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 h-2 w-2 rounded-full bg-green-400 opacity-60"></div>
                <div className="absolute top-40 right-20 h-3 w-3 rounded-full bg-blue-400 opacity-40"></div>
                <div className="absolute bottom-20 left-1/4 h-2 w-2 rounded-full bg-pink-400 opacity-50"></div>
            </div>

            <div className="relative container mx-auto px-4">
                {/* Header destacado */}
                <div className="mb-16 text-center">
                    <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-green-100 to-blue-100 px-8 py-3 text-sm font-semibold text-green-800 dark:from-green-900 dark:to-blue-900 dark:text-green-200">
                        <Star className="mr-2 h-4 w-4 fill-current" />
                        Destacados de la semana
                        <Star className="ml-2 h-4 w-4 fill-current" />
                    </div>

                    <h2 className="mb-6 text-5xl font-bold text-gray-800 lg:text-6xl dark:text-white">
                        Mascotas que buscan
                        <br />
                        <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            un hogar lleno de amor
                        </span>
                    </h2>

                    <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                        Aquí tienes una muestra de nuestras mascotas más recientes que buscan un hogar lleno de amor.
                        <span className="font-semibold text-green-600 dark:text-green-400"> ¿Serás tú su nueva familia?</span>
                    </p>
                </div>

                {/* Stats rápidas */}
                <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">Muchas</div>
                        <p className="text-gray-600 dark:text-gray-300">Mascotas disponibles</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">100%</div>
                        <p className="text-gray-600 dark:text-gray-300">Verificadas y sanas</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                        <p className="text-gray-600 dark:text-gray-300">Soporte post-adopción</p>
                    </div>
                </div>

                {/* Grid de mascotas mejorado */}
                <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {pets.map((pet, index) => (
                        <div key={index} className="group">
                            <PetCard {...pet} />
                        </div>
                    ))}
                </div>

                {/* Call to action prominente */}
                <div className="text-center">
                    <div className="inline-flex flex-col items-center rounded-3xl bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white shadow-2xl transition-all hover:scale-105 dark:from-green-600 dark:to-blue-600">
                        <Heart className="mb-4 h-12 w-12 fill-current" />
                        <h3 className="mb-2 text-2xl font-bold">¿Listo para adoptar?</h3>
                        <p className="mb-6 max-w-md text-center opacity-90">
                            Descubre todas nuestras mascotas disponibles y encuentra a tu compañero perfecto
                        </p>
                        <a
                            href="/mascotas"
                            className="inline-flex items-center rounded-full bg-white px-8 py-3 font-semibold text-green-600 transition-all hover:scale-105 hover:bg-gray-100"
                        >
                            Ver todas las mascotas
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
