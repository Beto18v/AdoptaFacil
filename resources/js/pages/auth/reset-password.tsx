import InputError from '@/components/input-error';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Link, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import Logo from '../../../../public/Logo/Logo.png';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
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
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                readOnly
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                autoFocus
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Ingresa tu nueva contraseña"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirma tu nueva contraseña"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
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
            </div>
            <ThemeSwitcher />
        </div>
    );
}
