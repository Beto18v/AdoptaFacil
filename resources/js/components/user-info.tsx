import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

// Mapeo de roles a los nombres deseados
const roleDisplayNames = {
    cliente: 'Amigo',
    aliado: 'Aliado',
    admin: 'Admin',
};

export function UserInfo({ user, showRole = false }: { user: User; showEmail?: boolean; showRole?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showRole && user.role && (
                    <div className="flex items-center justify-between">
                        <span className="truncate text-xs text-muted-foreground">{roleDisplayNames[user.role] || user.role}</span>
                    </div>
                )}
            </div>
        </>
    );
}
