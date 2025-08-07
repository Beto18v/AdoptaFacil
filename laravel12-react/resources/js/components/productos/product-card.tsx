import { Button } from '@/components/ui/button';
import { Heart, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
    id: number;
    nombre: string;
    descripcion: string;
    shelter: string;
    precio: number;
    imageUrl: string;
    onImageClick?: () => void;
    onViewDetails?: () => void;
}

export default function ProductCard({ nombre, shelter, descripcion, precio, imageUrl, onImageClick, onViewDetails }: ProductCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
            <div className="cursor-pointer" onClick={onImageClick}>
                <img src={imageUrl} alt={nombre} width={400} height={300} className="h-60 w-full object-cover transition-all group-hover:scale-105" />
            </div>
            <div className="p-4 dark:bg-gray-900 dark:text-gray-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{nombre}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{descripcion}</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <ShieldCheck className="mr-1.5 h-4 w-4 text-green-500" />
                            <span className="text-blue-600 dark:text-blue-400">Vendido por: {shelter}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-20">
                        <Heart className="h-5 w-5 text-gray-500 hover:fill-red-500 hover:text-red-500" />
                    </Button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-500">${precio ? precio.toLocaleString('es-CO') : '0'}</p>
                    <Button size="sm" className="z-20 bg-blue-600 hover:bg-blue-700 dark:bg-blue-400" onClick={onViewDetails}>
                        Ver detalle
                    </Button>
                </div>
            </div>
        </div>
    );
}
