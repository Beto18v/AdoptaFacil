import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { BadgeDollarSign, BellRing, BookHeart, ChartSpline, LayoutGrid, MapPinned } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Plantilla Única con TODOS los elementos de navegación
    const baseNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Favoritos',
            href: '/favoritos',
            icon: BookHeart,
        },
        {
            title: 'Solicitudes',
            href: '/solicitudes',
            icon: BellRing,
        },
        {
            title: 'Estadísticas',
            href: '/estadisticas',
            icon: ChartSpline,
        },
        {
            title: 'Mapa',
            href: '/mapa',
            icon: MapPinned,
        },
        {
            title: 'Donaciones',
            href: '/donaciones',
            icon: BadgeDollarSign,
        },
        {
            title: 'Productos y Mascotas',
            href: route('productos.mascotas'),
            icon: LayoutGrid,
        },
    ];

    // Lógica de filtrado centralizada
    let finalNavItems: NavItem[] = [];

    if (user.role === 'cliente') {
        // Rutas que SÍ debe ver el cliente (SIN productos y mascotas)
        const allowedHrefs = ['/dashboard', '/favoritos', '/mapa', '/donaciones', '/solicitudes'];
        finalNavItems = baseNavItems.filter((item) => allowedHrefs.includes(item.href as string));
    } else if (user.role === 'aliado') {
        // Rutas que SÍ debe ver el aliado (CON productos y mascotas, CON favoritos, SIN estadísticas)
        const allowedHrefs = ['/dashboard', '/favoritos', '/solicitudes', '/mapa', '/donaciones', route('productos.mascotas')];
        finalNavItems = baseNavItems.filter((item) => allowedHrefs.includes(item.href as string));
    } else {
        // Lógica para otros roles (El admin ve todo)
        finalNavItems = baseNavItems;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="justify-center" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={finalNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
