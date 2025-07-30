// resources/js/components/comunidad/share-button.tsx
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Propiedades del componente ShareButton
 */
interface ShareButtonProps {
    /** ID de la publicación a compartir */
    postId: number;
    /** Si el botón está deshabilitado */
    disabled?: boolean;
    /** Clases CSS adicionales */
    className?: string;
}

/**
 * Componente para compartir publicaciones en redes sociales y generar enlaces únicos
 * Permite compartir en WhatsApp, Facebook, Twitter, Telegram y copiar enlace al portapapeles
 */
export default function ShareButton({ postId, disabled = false, className = '' }: ShareButtonProps) {
    const [isSharing, setIsSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setShowShareMenu(false);
            }
        };

        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareMenu]);

    const handleShare = async () => {
        if (disabled || isSharing) return;

        setIsSharing(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            if (!csrfToken) {
                console.error('CSRF token no encontrado');
                return;
            }

            const response = await fetch(`/comunidad/posts/${postId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            const data = await response.json();

            if (data.success) {
                setShareUrl(data.url);
                setShowShareMenu(true);

                // Si el dispositivo soporta Web Share API
                if (navigator.share && window.innerWidth <= 768) {
                    // Solo en móviles
                    try {
                        await navigator.share({
                            title: 'Publicación de la comunidad',
                            text: 'Mira esta interesante publicación de nuestra comunidad',
                            url: data.url,
                        });
                        setShowShareMenu(false);
                    } catch {
                        // El usuario canceló el compartir, mostrar menú normal
                        console.log('Usuario canceló compartir nativo');
                    }
                }
            } else {
                console.error('Error al generar enlace de compartir');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSharing(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error);
        }
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: '📱',
            color: 'hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/50',
            url: `https://wa.me/?text=${encodeURIComponent(`Mira esta interesante publicación: ${shareUrl}`)}`,
        },
        {
            name: 'Facebook',
            icon: '📘',
            color: 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'Twitter',
            icon: '🐦',
            color: 'hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/50',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Mira esta publicación de la comunidad')}`,
        },
        {
            name: 'Telegram',
            icon: '✈️',
            color: 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50',
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Mira esta publicación')}`,
        },
    ];

    return (
        <div className={`relative flex-1 ${className}`}>
            <Button
                variant="ghost"
                className="w-full gap-2 text-gray-600 hover:bg-green-100 hover:text-green-600 dark:text-gray-400 dark:hover:bg-green-900/50 dark:hover:text-green-500"
                onClick={handleShare}
                disabled={disabled || isSharing}
            >
                <Share2 className={`h-5 w-5 ${isSharing ? 'animate-pulse' : ''}`} />
                <span className="text-sm">{isSharing ? 'Generando...' : 'Compartir'}</span>
            </Button>

            {showShareMenu && shareUrl && (
                <div
                    ref={shareMenuRef}
                    className="absolute top-full right-0 z-50 mt-2 min-w-72 rounded-lg border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="mb-3">
                        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Compartir en:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {shareOptions.map((option) => (
                                <a
                                    key={option.name}
                                    href={option.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${option.color} dark:text-gray-300`}
                                >
                                    <span className="text-lg">{option.icon}</span>
                                    {option.name}
                                    <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-3 dark:border-gray-600">
                        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">O copia el enlace:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 rounded border bg-gray-50 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            />
                            <Button
                                onClick={copyToClipboard}
                                size="sm"
                                className={`${copySuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                            >
                                {copySuccess ? (
                                    <>
                                        <span className="mr-1">✓</span>
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1 h-4 w-4" />
                                        Copiar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
