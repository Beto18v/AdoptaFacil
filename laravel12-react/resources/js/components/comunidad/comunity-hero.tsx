export default function ComunityHero() {
    return (
        <section className="relative bg-gradient-to-r from-green-400 to-blue-500 py-20 pt-35 dark:from-green-600 dark:to-blue-700">
            {/* Contenido de texto centrado */}
            <div className="relative container mx-auto px-4 text-center text-white">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Unete a nuestra Comunidad</h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
                    Comparte historias, consejos, eventos y conecta con personas que, como tú, buscan el bienestar animal.
                </p>
            </div>
        </section>
    );
}
