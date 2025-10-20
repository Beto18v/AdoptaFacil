import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Mail, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Gestión de Usuarios', href: route('gestion.usuarios') }];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function GestionUsuarios() {
    const { usuarios, errors } = usePage<{ usuarios: User[]; errors?: Record<string, string> }>().props;
    const [filterRole, setFilterRole] = useState<string>('all');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'cliente' });

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

    const handleEditUser = (user: User) => {
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

    const handleSendBulkEmail = () => {
        router.post(route('gestion.usuarios.send-bulk-email'), { user_ids: selectedUsers });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                        <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-40">
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
                    <div className="flex gap-2">
                        {selectedUsers.length > 0 && (
                            <Button onClick={handleSendBulkEmail} variant="outline">
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar Correo ({selectedUsers.length})
                            </Button>
                        )}
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Usuario
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Nombre
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="col-span-3"
                                        />
                                        {errors?.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="col-span-3"
                                        />
                                        {errors?.email && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="col-span-3"
                                        />
                                        {errors?.password && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.password}</p>}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">
                                            Rol
                                        </Label>
                                        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cliente">Cliente</SelectItem>
                                                <SelectItem value="aliado">Aliado</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors?.role && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.role}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleCreateUser}>Crear</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Editar Usuario</DialogTitle>
                                </DialogHeader>
                                {editingUser && (
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-name" className="text-right">
                                                Nombre
                                            </Label>
                                            <Input
                                                id="edit-name"
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-email" className="text-right">
                                                Email
                                            </Label>
                                            <Input
                                                id="edit-email"
                                                type="email"
                                                value={editingUser.email}
                                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-role" className="text-right">
                                                Rol
                                            </Label>
                                            <Select
                                                value={editingUser.role}
                                                onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                                            >
                                                <SelectTrigger className="col-span-3">
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
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleUpdateUser}>Actualizar</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="rounded-lg border bg-white shadow dark:bg-gray-800">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="w-32">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => handleSelectUser(user.id)} />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
