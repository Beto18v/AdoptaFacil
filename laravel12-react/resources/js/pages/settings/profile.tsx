import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Camera, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de perfil',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    avatar?: File | null;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(auth.user.avatar ? `/storage/${auth.user.avatar}` : null);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [manualSuccess, setManualSuccess] = useState<boolean>(false);

    const { data, setData, patch, post, errors, processing, recentlySuccessful, clearErrors, setError } = useForm<ProfileForm>({
        name: auth.user.name || '',
        email: auth.user.email || '',
        avatar: null,
    });

    // Detectar si hubo un cambio exitoso usando el status de Laravel y estado manual
    const wasSuccessful = recentlySuccessful || status === 'profile-updated' || manualSuccess;

    // Mostrar mensaje de éxito y ocultarlo después de 3 segundos
    useEffect(() => {
        if (wasSuccessful) {
            setShowSuccessMessage(true);
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000); // 3 segundos

            return () => clearTimeout(timer);
        } else {
            setShowSuccessMessage(false);
        }
    }, [wasSuccessful]);

    // Actualizar previewUrl cuando cambie el avatar del usuario (después de actualización)
    useEffect(() => {
        if (auth.user.avatar) {
            setPreviewUrl(`/storage/${auth.user.avatar}`);
        } else {
            setPreviewUrl(null);
        }
    }, [auth.user.avatar]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido.');
                return;
            }

            // Validar tamaño (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo es 2MB.');
                return;
            }

            setData('avatar', file);

            // Crear URL de preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveAvatar = () => {
        // Si hay un preview temporal, solo limpiarlo
        if (data.avatar) {
            setData('avatar', null);
            setPreviewUrl(auth.user.avatar ? `/storage/${auth.user.avatar}` : null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Si el usuario tenía un avatar guardado, enviar la actualización para eliminarlo
        if (auth.user.avatar) {
            router.post(
                route('profile.update'),
                {
                    name: data.name,
                    email: data.email,
                    avatar: null,
                    _method: 'PATCH',
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Activar el estado manual de éxito
                        setManualSuccess(true);
                        setTimeout(() => setManualSuccess(false), 500);
                    },
                    onError: (errors) => {
                        // Manejar errores si los hay
                        setManualSuccess(false);
                        setShowSuccessMessage(false);
                    },
                },
            );
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.avatar) {
            // Cuando hay avatar, usar router.post con FormData
            router.post(
                route('profile.update'),
                {
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    _method: 'PATCH',
                },
                {
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: () => {
                        // Resetear solo el campo avatar del formulario
                        setData('avatar', null);

                        // Limpiar el input file
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }

                        // Activar el estado manual de éxito
                        setManualSuccess(true);
                        setTimeout(() => setManualSuccess(false), 500);
                    },
                    onError: (errors) => {
                        // Sincronizar errores con el hook useForm
                        Object.keys(errors).forEach(key => {
                            setError(key as keyof ProfileForm, errors[key] as string);
                        });
                        setManualSuccess(false);
                        setShowSuccessMessage(false);
                    },
                },
            );
        } else {
            // Sin avatar, usar router.post pero con datos específicos para mejor manejo de errores
            router.post(
                route('profile.update'),
                {
                    name: data.name,
                    email: data.email,
                    _method: 'PATCH',
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Activar el estado manual de éxito
                        setManualSuccess(true);
                        setTimeout(() => setManualSuccess(false), 500);
                    },
                    onError: (errors) => {
                        // Sincronizar errores con el hook useForm
                        Object.keys(errors).forEach(key => {
                            setError(key as keyof ProfileForm, errors[key] as string);
                        });
                        setManualSuccess(false);
                        setShowSuccessMessage(false);
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Información de perfil" description="Mantenga su información actualizada" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Campo de foto de perfil */}
                        <div className="grid gap-4">
                            <Label>Foto de perfil</Label>

                            <div className="flex items-center gap-6">
                                <div className="group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <Avatar className="h-20 w-20 transition-all duration-200 group-hover:brightness-75">
                                        <AvatarImage
                                            src={previewUrl || (auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined)}
                                            alt={auth.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <AvatarFallback className="text-lg">{auth.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    {/* Overlay con el texto "Cambiar" */}
                                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <div className="text-center text-white">
                                            <Camera className="mx-auto mb-1 h-5 w-5" />
                                            <span className="text-xs font-medium">Cambiar</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        {(previewUrl || auth.user.avatar) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveAvatar}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                                Eliminar
                                            </Button>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Haz clic en la foto para cambiarla.
                                        <br />
                                        JPG, PNG o GIF. Máximo 2MB.
                                    </p>
                                </div>
                            </div>

                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

                            <InputError className="mt-2" message={errors.avatar} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>

                            <Input
                                id="name"
                                className={`mt-1 block w-full ${errors.name ? 'border-red-500' : ''}`}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Ingresa tu nombre completo"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>

                            <Input
                                id="email"
                                type="email"
                                className={`mt-1 block w-full ${errors.email ? 'border-red-500' : ''}`}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="tu@email.com"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Tu correo electrónico no está verificado.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Clic aquí para reenviar el correo electrónico de verificación.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Guardar
                            </Button>

                            <Transition
                                show={showSuccessMessage}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Cambio realizado</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
            <ThemeSwitcher />
        </AppLayout>
    );
}
