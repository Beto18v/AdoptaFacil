import { Link } from '@inertiajs/react';

interface PetCardProps {
    name: string;
    breed: string;
    age: string;
    description: string;
    imageUrl: string;
}

export default function PetCard({ name, breed, age, description, imageUrl }: PetCardProps) {
    return (
        <div className="pet-card dark:shadow-dark overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl dark:bg-gray-700">
            <img src={imageUrl} alt={`${name} - ${breed}`} className="h-48 w-full object-cover" loading="lazy" />
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-300">
                    {breed} • {age}
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{description}</p>
                <Link
                    href="/mascotas"
                    className="block w-full rounded-lg bg-blue-600 py-2 text-center text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Conocer más
                </Link>
            </div>
        </div>
    );
}
