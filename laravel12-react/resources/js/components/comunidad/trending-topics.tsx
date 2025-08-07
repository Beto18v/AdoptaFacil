// resources/js/components/comunidad/trending-topics.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Flame, Hash } from 'lucide-react';

const topAllies = [
    { name: 'Fundación Huellitas Felices', avatarUrl: 'https://i.pravatar.cc/150?u=huellitasfelices', link: '#' },
    { name: 'Veterinaria El Arca', avatarUrl: 'https://i.pravatar.cc/150?u=elarca', link: '#' },
    { name: 'AdoptaFácil Admin', avatarUrl: 'https://i.pravatar.cc/150?u=adoptafaciladmin', link: '#' },
];

const popularTags = ['#Esterilizacion', '#AdoptaNoCompres', '#JornadaDeVacunacion', '#Bogota', '#Gatos'];

export default function TrendingTopics() {
    return (
        <div className="sticky top-24 space-y-8">
            {/* Aliados Destacados */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
                <h3 className="mb-4 flex items-center text-lg font-bold text-gray-900 dark:text-white">
                    <Flame className="mr-2 h-5 w-5 text-orange-500" />
                    Aliados Destacados
                </h3>
                <div className="space-y-4">
                    {topAllies.map((ally) => (
                        <div key={ally.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={ally.avatarUrl} alt={ally.name} />
                                    <AvatarFallback>{ally.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{ally.name}</span>
                            </div>
                            <Button className="dark:bg-gray-700" variant="outline" size="sm" asChild>
                                <a href={ally.link}>Ver</a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Temas Populares */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
                <h3 className="mb-4 flex items-center text-lg font-bold text-gray-900 dark:text-white">
                    <Hash className="mr-2 h-5 w-5 text-blue-500" />
                    Temas Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                        <Button
                            key={tag}
                            variant="secondary"
                            className="rounded-full text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
