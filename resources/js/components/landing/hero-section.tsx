export default function HeroSection() {
    return (
        <section className="relative bg-gradient-to-r from-green-400 to-blue-500 py-20 pt-35 dark:from-green-600 dark:to-blue-700">
            <div className="container mx-auto px-4 text-center">
                <h2 className="mb-6 text-4xl font-bold">Encuentra a tu nuevo mejor amigo</h2>
                <p className="mx-auto mb-8 max-w-2xl text-xl">Conectamos a mascotas necesitadas con hogares amorosos desde 2025</p>

                <form className="mx-auto flex max-w-2xl flex-col space-y-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row sm:space-y-0 dark:bg-gray-800">
                    <input
                        type="text"
                        name="busqueda_mascota" //
                        placeholder="Buscar por raza (Ej: Perro, Gato)"
                        className="w-full rounded-lg px-4 py-3 text-gray-700 focus:outline-none sm:flex-1 sm:rounded-l-lg sm:rounded-r-none dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    />
                    <input
                        type="text"
                        name="ciudad"
                        placeholder="Ciudad"
                        className="w-full rounded-lg border-t border-gray-200 px-4 py-3 text-gray-700 focus:outline-none sm:flex-1 sm:rounded-none sm:border-t-0 sm:border-l dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 sm:w-auto sm:rounded-l-none sm:rounded-r-lg dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Buscar
                    </button>
                </form>
            </div>
        </section>
    );
}
