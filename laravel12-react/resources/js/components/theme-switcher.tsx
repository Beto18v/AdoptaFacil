import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Paintbrush, Sun } from 'lucide-react';

export function ThemeSwitcher() {
    // Se desestructura updateAppearance en lugar de setTheme
    const { updateAppearance } = useAppearance();

    return (
        <div className="fixed right-6 bottom-6 z-50">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-lg">
                        <Paintbrush className="h-[1.5rem] w-[1.5rem] scale-100 rotate-0 transition-all" />
                        <span className="sr-only">Cambiar tema</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Corregido: Se llama a updateAppearance en los eventos onClick */}
                    <DropdownMenuItem onClick={() => updateAppearance('light')}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Claro</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Oscuro</span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => updateAppearance('blue')}>
                        <Palette className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Azul</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppearance('green')}>
                        <Leaf className="bg- mr-2 h-4 w-4 text-green-500" />
                        <span>Verde</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => updateAppearance('system')}>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>Sistema</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
