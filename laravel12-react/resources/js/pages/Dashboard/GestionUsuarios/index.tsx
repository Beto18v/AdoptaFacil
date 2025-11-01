import { ThemeSwitcher } from '@/components/theme-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Mail, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Gestión de Usuarios', href: route('gestion.usuarios') }];

type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function GestionUsuarios() {
    const { usuarios, errors } = usePage<{ usuarios: UserType[]; errors?: Record<string, string> }>().props;
    const [filterRole, setFilterRole] = useState<string>('all');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'cliente' });
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailDescription, setEmailDescription] = useState('');
    const [additionalRecipients, setAdditionalRecipients] = useState<string[]>([]);
    const [showAllRecipients, setShowAllRecipients] = useState(false);

    const filteredUsers = filterRole === 'all' ? usuarios : usuarios.filter((user) => user.role === filterRole);

    const handleSelectUser = (userId: number) => {
        setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
    };

    const handleSelectAll = () => {
        setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((user) => user.id));
    };

    const handleCreateUser = () => {
        router.post(route('gestion.usuarios.store'), newUser, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                setNewUser({ name: '', email: '', password: '', role: 'cliente' });
            },
        });
    };

    const handleEditUser = (user: UserType) => {
        setEditingUser(user);
        setIsEditDialogOpen(true);
    };

    const handleUpdateUser = () => {
        if (editingUser) {
            router.put(
                route('gestion.usuarios.update', editingUser.id),
                {
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role,
                },
                {
                    onSuccess: () => {
                        setIsEditDialogOpen(false);
                        setEditingUser(null);
                    },
                },
            );
        }
    };

    const handleDeleteUser = (userId: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            router.delete(route('gestion.usuarios.destroy', userId));
        }
    };

    const handleSendBulkEmail = async () => {
        const selectedEmails = selectedUsers
            .map((userId) => {
                const user = usuarios.find((u) => u.id === userId);
                return user ? user.email : null;
            })
            .filter((email) => email !== null);

        const allEmails = [...selectedEmails, ...additionalRecipients];

        try {
            const response = await fetch('http://localhost:8080/api/send-bulk-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emails: allEmails,
                    subject: emailSubject,
                    description: emailDescription,
                }),
            });

            if (response.ok) {
                alert('Correos enviados exitosamente');
                setIsEmailModalOpen(false);
                setEmailSubject('');
                setEmailDescription('');
                setAdditionalRecipients([]);
            } else {
                const errorText = await response.text();
                alert('Error al enviar correos: ' + errorText);
            }
        } catch (error) {
            alert('Error de conexión: ' + (error as Error).message);
        }
    };

    const generateEmailHTML = (subject: string, description: string) => {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .logo { text-align: center; margin-bottom: 20px; }
                    .logo img { width: 100px; }
                    h1 { color: #4CAF50; text-align: center; }
                    p { line-height: 1.6; }
                    .cta-button { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                        <img src="/Logo/Logo.png" alt="AdoptaFácil Logo">
                    </div>
                    <h1>${subject}</h1>
                    <p>Hola,</p>
                    <p>${description.replace(/\n/g, '<br>')}</p>
                    <p>¡Gracias por ser parte de AdoptaFácil!</p>
                    <a href="#" class="cta-button">Visitar AdoptaFácil</a>
                    <footer>
                        <p>AdoptaFácil - Conectando corazones con patitas</p>
                        <p>Si tienes alguna pregunta, contáctanos en info@adoptafacil.com</p>
                    </footer>
                </div>
            </body>
            </html>
        `;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <main className="flex-1 overflow-y-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 dark:from-green-600 dark:to-blue-700">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                        <div className="flex items-center gap-4">
                            <Select value={filterRole} onValueChange={setFilterRole}>
                                <SelectTrigger className="w-48 border-white/20 bg-white/90 text-gray-900 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                    <SelectValue placeholder="Filtrar por rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="cliente">Cliente</SelectItem>
                                    <SelectItem value="aliado">Aliado</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <div className="text-white/80 dark:text-gray-200">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
                        </div>
                        <div className="flex gap-2">
                            {selectedUsers.length > 0 && (
                                <Button
                                    onClick={() => setIsEmailModalOpen(true)}
                                    variant="outline"
                                    className="border-white/20 bg-white/90 text-gray-900 backdrop-blur-sm hover:bg-white dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/80"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Enviar Correo ({selectedUsers.length})
                                </Button>
                            )}
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-white text-green-600 hover:bg-gray-100 dark:bg-gray-800/90 dark:text-green-400 dark:hover:bg-gray-700/80">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Usuario
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-lg bg-white p-6 dark:bg-gray-800 dark:text-gray-100">
                                    <DialogHeader>
                                        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-200">
                                                Nombre
                                            </Label>
                                            <Input
                                                id="name"
                                                value={newUser.name}
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                className="col-span-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors?.name && (
                                                <p className="col-span-3 col-start-2 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right text-gray-700 dark:text-gray-200">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                className="col-span-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors?.email && (
                                                <p className="col-span-3 col-start-2 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password" className="text-right text-gray-700 dark:text-gray-200">
                                                Contraseña
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                className="col-span-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors?.password && (
                                                <p className="col-span-3 col-start-2 text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="role" className="text-right text-gray-700 dark:text-gray-200">
                                                Rol
                                            </Label>
                                            <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                                                <SelectTrigger className="col-span-3 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cliente">Cliente</SelectItem>
                                                    <SelectItem value="aliado">Aliado</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors?.role && (
                                                <p className="col-span-3 col-start-2 text-sm text-red-500 dark:text-red-400">{errors.role}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsCreateDialogOpen(false)}
                                            className="border-gray-300 dark:border-gray-600 dark:text-gray-200"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleCreateUser}
                                            className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
                                        >
                                            Crear
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogContent className="rounded-lg bg-white p-6 dark:bg-gray-800 dark:text-gray-100">
                                    <DialogHeader>
                                        <DialogTitle>Editar Usuario</DialogTitle>
                                    </DialogHeader>
                                    {editingUser && (
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-name" className="text-right text-gray-700 dark:text-gray-200">
                                                    Nombre
                                                </Label>
                                                <Input
                                                    id="edit-name"
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    className="col-span-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-email" className="text-right text-gray-700 dark:text-gray-200">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="edit-email"
                                                    type="email"
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    className="col-span-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-role" className="text-right text-gray-700 dark:text-gray-200">
                                                    Rol
                                                </Label>
                                                <Select
                                                    value={editingUser.role}
                                                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                                                >
                                                    <SelectTrigger className="col-span-3 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="cliente">Cliente</SelectItem>
                                                        <SelectItem value="aliado">Aliado</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditDialogOpen(false)}
                                            className="border-gray-300 dark:border-gray-600 dark:text-gray-200"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleUpdateUser}
                                            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                                        >
                                            Actualizar
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                                <DialogContent className="max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-800 dark:text-gray-100 max-h-[95vh] overflow-auto">
                                    <DialogHeader>
                                        <DialogTitle>Enviar Correo Masivo</DialogTitle>
                                        <DialogDescription>
                                            Envía un correo electrónico a los usuarios seleccionados con un asunto y descripción personalizados.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Destinatarios</Label>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {(() => {
                                                    const allRecipients = [
                                                        ...selectedUsers
                                                            .map((userId) => {
                                                                const user = usuarios.find((u) => u.id === userId);
                                                                return user ? { name: user.name, email: user.email } : null;
                                                            })
                                                            .filter(Boolean),
                                                        ...additionalRecipients.map((email) => ({ name: '', email })),
                                                    ];
                                                    const displayedRecipients = showAllRecipients ? allRecipients : allRecipients.slice(0, 2);
                                                    return (
                                                        <>
                                                            {displayedRecipients.map((recipient, index) => (
                                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                                    {recipient!.name ? `${recipient!.name} <${recipient!.email}>` : recipient!.email}
                                                                </Badge>
                                                            ))}
                                                            {allRecipients.length > 2 && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setShowAllRecipients(!showAllRecipients)}
                                                                    className="text-xs"
                                                                >
                                                                    {showAllRecipients ? 'Ver menos' : `Ver todos (${allRecipients.length - 2})`}
                                                                </Button>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="email-subject" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Asunto
                                            </Label>
                                            <Input
                                                id="email-subject"
                                                placeholder="Escribe el asunto del correo..."
                                                value={emailSubject}
                                                onChange={(e) => setEmailSubject(e.target.value)}
                                                className="mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email-description" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Descripción
                                            </Label>
                                            <Textarea
                                                id="email-description"
                                                placeholder="Redacta el mensaje que deseas enviar..."
                                                value={emailDescription}
                                                onChange={(e) => setEmailDescription(e.target.value)}
                                                rows={4}
                                                className="mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Previsualización</Label>
                                            <div className="mt-2 rounded-lg border bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                                                <iframe
                                                    srcDoc={generateEmailHTML(emailSubject, emailDescription)}
                                                    className="w-full rounded border-0"
                                                    style={{ height: '400px' }}
                                                    title="Email Preview"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEmailModalOpen(false)}
                                            className="border-gray-300 dark:border-gray-600 dark:text-gray-200"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleSendBulkEmail}
                                            disabled={
                                                !emailSubject.trim() ||
                                                !emailDescription.trim() ||
                                                selectedUsers.length + additionalRecipients.length === 0
                                            }
                                            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
                                        >
                                            Enviar
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white/90 shadow-xl backdrop-blur-sm dark:bg-gray-800/90">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 dark:bg-gray-700/50">
                                    <TableHead className="w-12 rounded-tl-lg">
                                        <Checkbox
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onCheckedChange={handleSelectAll}
                                            className="border-gray-300 dark:border-gray-600"
                                        />
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Nombre</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Rol</TableHead>
                                    <TableHead className="w-32 rounded-tr-lg font-semibold text-gray-900 dark:text-gray-100">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => handleSelectUser(user.id)}
                                                className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700/50"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{user.name}</TableCell>
                                        <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                    user.role === 'admin'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        : user.role === 'aliado'
                                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditUser(user)}
                                                    className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="animate-fade-in mt-10 rounded-lg bg-white p-16 text-center text-lg text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-400">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <User className="h-12 w-12 text-green-600 dark:text-green-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">No hay usuarios con ese filtro</h3>
                            <p className="mb-6">Cambia el filtro o crea un nuevo usuario</p>
                        </div>
                    )}
                </div>
            </main>
            <ThemeSwitcher />
        </AppLayout>
    );
}
