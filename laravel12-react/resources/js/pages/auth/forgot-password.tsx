import InputError from '@/components/input-error';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import Logo from '../../../../public/Logo/Logo.png';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    // Lógica de traducción
    let statusMessage = status;
    if (status === 'A reset link will be sent if the account exists.') {
        statusMessage = 'Se enviará un enlace de restablecimiento si la cuenta existe.';
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700">
            <div className="container w-full max-w-md rounded-lg border border-white/20 bg-white/10 p-5 text-center shadow-lg backdrop-blur-md transition-transform duration-300 ease-in-out hover:scale-[1.005] hover:shadow-xl">
                <Link href={route('index')}>
                    <img src={Logo} alt="Logo" className="mx-auto mb-8 h-36 w-56" />
                </Link>{' '}
                <Head title="Recuperar contraseña" />
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recuperar contraseña</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Ingresa tu correo electrónico para recibir un enlace de recuperación</p>
                </div>
                {/* Se muestra el mensaje traducido */}
                {statusMessage && <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">{statusMessage}</div>}
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <Button
                            type="submit"
                            className="focus:ring-opacity-50 w-full transform rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Enviar enlace de recuperación
                        </Button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <span>O, vuelve a </span>
                    <Link href={route('login')} className="text-blue-500 hover:underline dark:text-gray-100">
                        iniciar sesión
                    </Link>
                </div>
            </div>
            <ThemeSwitcher />
        </div>
    );
}
