import InputError from '@/components/input-error';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import Logo from '../../../../public/Logo/Logo.png';

type ResetPasswordForm = {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
};

type ResetPasswordProps = {
    email?: string;
};

export default function ResetPassword({ email }: ResetPasswordProps) {
    const [data, setData] = useState<ResetPasswordForm>({
        email: email ? decodeURIComponent(email) : '',
        token: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState<string>('');

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMessage('');

        // Validación básica
        if (data.newPassword !== data.confirmPassword) {
            setErrors({ confirmPassword: 'Las contraseñas no coinciden.' });
            setProcessing(false);
            return;
        }

        if (data.newPassword.length < 8) {
            setErrors({ newPassword: 'La contraseña debe tener al menos 8 caracteres.' });
            setProcessing(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    token: data.token,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword,
                }),
            });

            let result;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = { message: await response.text() };
            }

            if (response.ok) {
                setMessage('Contraseña actualizada exitosamente.');
                // Limpiar el formulario después de éxito
                setData({
                    email: '',
                    token: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                // Redirigir al dashboard después de un breve delay para mostrar el mensaje
                setTimeout(() => {
                    router.visit(route('dashboard'));
                }, 1500);
            } else {
                // Manejar diferentes tipos de errores del servidor
                if (response.status === 400) {
                    if (result.message) {
                        setErrors({ general: result.message });
                    } else {
                        setErrors({ general: 'Datos inválidos. Verifica la información e intenta de nuevo.' });
                    }
                } else if (response.status === 500) {
                    setErrors({ general: 'Error interno del servidor. Inténtalo de nuevo.' });
                } else {
                    setErrors({ general: result.message || 'Error desconocido. Inténtalo de nuevo.' });
                }
            }
        } catch (error) {
            // Error de conexión de red
            console.error('Error de conexión:', error);
            setErrors({ general: 'Error de conexión. Verifica que el servidor esté ejecutándose.' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700">
            {/* Contenedor principal */}
            <div className="container w-full max-w-md rounded-lg border border-white/20 bg-white/10 p-5 text-center shadow-lg backdrop-blur-md transition-transform duration-300 ease-in-out hover:scale-[1.005] hover:shadow-xl">
                {/* Logo */}
                <Link href={route('index')}>
                    <img src={Logo} alt="Logo" className="mx-auto mb-8 h-36 w-56" />
                </Link>
                <Head title="Restablecer contraseña" />
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Restablecer contraseña</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Ingresa el código de 6 dígitos enviado a tu email y tu nueva contraseña.</p>
                </div>

                {/* Mensaje de éxito o error */}
                {message && <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">{message}</div>}
                {errors.general && <div className="mb-4 text-center text-sm font-medium text-red-600 dark:text-red-400">{errors.general}</div>}

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                placeholder="email@example.com"
                                disabled={!!email}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="token">Código de Recuperación</Label>
                            <Input
                                id="token"
                                type="text"
                                name="token"
                                value={data.token}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setData({ ...data, token: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                placeholder="123456"
                                maxLength={6}
                                autoFocus
                            />
                            <InputError message={errors.token} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                autoComplete="new-password"
                                value={data.newPassword}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                                placeholder="Ingresa tu nueva contraseña"
                            />
                            <InputError message={errors.newPassword} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                autoComplete="new-password"
                                value={data.confirmPassword}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                placeholder="Confirma tu nueva contraseña"
                            />
                            <InputError message={errors.confirmPassword} />
                        </div>

                        <Button
                            type="submit"
                            className="focus:ring-opacity-50 mt-4 w-full transform rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Restablecer contraseña
                        </Button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <span>Volver a </span>
                    <Link href={route('login')} className="text-blue-500 hover:underline dark:text-gray-100">
                        iniciar sesión
                    </Link>
                </div>
            </div>
            <ThemeSwitcher />
        </div>
    );
}
