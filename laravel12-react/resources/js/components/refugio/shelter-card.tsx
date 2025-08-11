import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { type SharedData, type Shelter } from '@/types';
import { usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import FormularioDonacion from '../../pages/Dashboard/Donaciones/components/formulario-donacion';

interface ShelterCardProps {
    shelter: Shelter;
}

export default function ShelterCard({ shelter }: ShelterCardProps) {
    const { auth } = usePage<SharedData>().props;
    const [showDonationForm, setShowDonationForm] = useState(false);

    const handleDonateClick = () => {
        if (!auth.user) {
            window.location.href = route('login');
        } else {
            setShowDonationForm(true);
        }
    };

    return (
        <>
            <div className="group relative flex h-full transform flex-col overflow-hidden rounded-xl bg-white text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-900 dark:text-gray-200">
                <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={shelter.user?.avatar ? `/storage/${shelter.user.avatar}` : undefined} alt={shelter.user?.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    {shelter.user?.name?.substring(0, 2).toUpperCase() || 'AL'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{shelter.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Registrado por: {shelter.user?.name || 'Aliado'}</p>
                            </div>
                        </div>
                    </div>

                    <p className="mb-6 text-base text-gray-700 dark:text-gray-300">{shelter.description}</p>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{shelter.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>
                                {shelter.address}, {shelter.city}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{shelter.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Sección inferior con botón de donar y contador */}
                <div className="mt-auto flex items-center justify-between p-6">
                    <Button
                        onClick={handleDonateClick}
                        className="w-auto bg-green-600 text-white transition-colors duration-300 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                        Donar
                    </Button>
                    {/* Contador de Donaciones */}
                    <div className="bg-opacity-50 rounded-lg bg-black px-3 py-1 text-white">
                        <p className="text-sm font-semibold">Donaciones: {shelter.donations_count}</p>
                    </div>
                </div>
            </div>

            {showDonationForm && <FormularioDonacion showModal={showDonationForm} onClose={() => setShowDonationForm(false)} shelters={[shelter]} />}
        </>
    );
}
