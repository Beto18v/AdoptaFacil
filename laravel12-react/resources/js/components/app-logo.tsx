import { useSidebar } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';
import Logo from '../../../public/Logo/Logo.png';
import LogoWhite from '../../../public/Logo/LogoWhite.png';

export default function AppLogo() {
    const { state } = useSidebar();

    return (
        <Link href={route('index')} className="flex items-center justify-center">
            {state === 'collapsed' ? (
                // Ícono cuando está colapsado
                <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
                // Logo completo cuando está expandido
                <>
                    <img src={Logo} alt="Logo" className="mx-auto block h-12 w-auto max-w-[120px] dark:hidden" />
                    <img src={LogoWhite} alt="Logo" className="mx-auto hidden h-12 w-auto max-w-[120px] dark:block" />
                </>
            )}
        </Link>
    );
}
