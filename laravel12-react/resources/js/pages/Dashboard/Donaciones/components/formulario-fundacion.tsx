// resources/js/Pages/Dashboard/Donaciones/components/FormularioFundacion.tsx
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationPicker } from '@/components/ui/location-picker'; // Importa el componente de mapa interactivo
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function FormularioFundacion() {
    const page = usePage();
    const auth = (page.props as unknown as { auth: { user?: { name?: string; email?: string } } }).auth;

    // Estado del formulario, ahora incluye latitude y longitude
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: auth?.user?.email || '',
        description: '',
        address: '',
        city: '',
        phone: '',
        bank_name: '',
        account_type: 'Ahorros', // Valor inicial por defecto
        account_number: '',
        latitude: 4.6097, // Valor inicial para Colombia
        longitude: -74.0817,
    });

    // Función para actualizar lat/lng desde el mapa interactivo
    const handleLocationChange = (lat: number, lng: number) => {
        setData('latitude', lat);
        setData('longitude', lng);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('shelter.store'));
    };

    // Estilo unificado para los campos de entrada
    const inputStyle =
        'mt-2 block w-full p-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400';

    return (
        <div className="mx-auto max-w-4xl space-y-6 rounded-2xl bg-gray-100 p-8 shadow-2xl dark:bg-gray-800">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Registra tu Fundación</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Completa la siguiente información para que los donantes puedan conocerte y apoyarte.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-8">
                {/* --- INFORMACIÓN GENERAL --- */}
                <fieldset className="space-y-6">
                    <legend className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900 dark:border-gray-600 dark:text-white">
                        Información General
                    </legend>
                    <div>
                        <Label htmlFor="name" className="font-semibold text-gray-700 dark:text-gray-300">
                            Nombre de la Fundación
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputStyle}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300">
                            Correo Electrónico de Contacto
                        </Label>
                        <Input id="email" name="email" value={data.email} readOnly className={`${inputStyle} cursor-not-allowed`} />
                    </div>
                    <div>
                        <Label htmlFor="description" className="font-semibold text-gray-700 dark:text-gray-300">
                            Descripción o Misión
                        </Label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={inputStyle}
                            rows={4}
                            required
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                </fieldset>

                {/* --- INFORMACIÓN DE CONTACTO --- */}
                <fieldset className="space-y-6">
                    <legend className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900 dark:border-gray-600 dark:text-white">
                        Información de Contacto
                    </legend>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="address" className="font-semibold text-gray-700 dark:text-gray-300">
                                Dirección
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className={inputStyle}
                                required
                            />
                            <InputError message={errors.address} className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="city" className="font-semibold text-gray-700 dark:text-gray-300">
                                Ciudad
                            </Label>
                            <Input
                                id="city"
                                name="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className={inputStyle}
                                required
                            />
                            <InputError message={errors.city} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="phone" className="font-semibold text-gray-700 dark:text-gray-300">
                                Teléfono
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={inputStyle}
                                required
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>
                    </div>
                    {/* --- UBICACIÓN EN EL MAPA --- */}
                    <div className="mt-6">
                        <Label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">Ubicación en el Mapa</Label>
                        {/* Mapa interactivo para seleccionar la ubicación */}
                        <LocationPicker initialLat={data.latitude} initialLng={data.longitude} onLocationChange={handleLocationChange} />
                        <div className="mt-2 text-xs text-gray-500">
                            Latitud: {data.latitude.toFixed(6)}, Longitud: {data.longitude.toFixed(6)}
                        </div>
                        <InputError message={errors.latitude} className="mt-2" />
                        <InputError message={errors.longitude} className="mt-2" />
                    </div>
                </fieldset>

                {/* --- INFORMACIÓN PARA DONACIONES --- */}
                <fieldset className="space-y-6">
                    <legend className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900 dark:border-gray-600 dark:text-white">
                        Información para Donaciones
                    </legend>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="bank_name" className="font-semibold text-gray-700 dark:text-gray-300">
                                Nombre del Banco
                            </Label>
                            <Input
                                id="bank_name"
                                name="bank_name"
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                                className={inputStyle}
                                required
                            />
                            <InputError message={errors.bank_name} className="mt-2" />
                        </div>

                        <div>
                            <Label className="font-semibold text-gray-700 dark:text-gray-300">Tipo de Cuenta</Label>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <label
                                    className={`flex cursor-pointer items-center justify-center rounded-lg p-3 text-center text-sm font-medium shadow-sm transition-all ${
                                        data.account_type === 'Ahorros'
                                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800'
                                            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="account_type"
                                        value="Ahorros"
                                        checked={data.account_type === 'Ahorros'}
                                        onChange={(e) => setData('account_type', e.target.value)}
                                        className="sr-only"
                                    />
                                    Ahorros
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center justify-center rounded-lg p-3 text-center text-sm font-medium shadow-sm transition-all ${
                                        data.account_type === 'Corriente'
                                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800'
                                            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="account_type"
                                        value="Corriente"
                                        checked={data.account_type === 'Corriente'}
                                        onChange={(e) => setData('account_type', e.target.value)}
                                        className="sr-only"
                                    />
                                    Corriente
                                </label>
                            </div>
                            <InputError message={errors.account_type} className="mt-2" />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="account_number" className="font-semibold text-gray-700 dark:text-gray-300">
                                Número de Cuenta
                            </Label>
                            <Input
                                id="account_number"
                                name="account_number"
                                value={data.account_number}
                                onChange={(e) => setData('account_number', e.target.value.replace(/[^0-9]/g, ''))}
                                className={inputStyle}
                                required
                            />
                            <InputError message={errors.account_number} className="mt-2" />
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full transform rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:from-indigo-700 hover:to-purple-700 disabled:scale-100 disabled:opacity-50 md:w-auto"
                    >
                        {processing ? 'Registrando...' : 'Registrar mi Fundación'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
