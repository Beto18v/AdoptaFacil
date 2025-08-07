import { Link } from '@inertiajs/react';
import Logo from '../../../public/Logo/Logo.png';
import LogoWhite from '../../../public/Logo/LogoWhite.png';

export default function AppLogo() {
    return (
        <Link href={route('index')}>
            <img src={Logo} alt="Logo" className="mx-auto block h-15 w-25 dark:hidden" />
            <img src={LogoWhite} alt="Logo" className="mx-auto hidden h-15 w-25 dark:block" />
        </Link>
    );
}
