import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix para los iconos de Leaflet en Webpack
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Location {
    id: string;
    city: string;
    name?: string;
    count: number;
    shelters?: number;
    lat: number;
    lng: number;
    address?: string;
}

interface InteractiveMapProps {
    locations: Location[];
    className?: string;
}

export function InteractiveMap({ locations, className = '' }: InteractiveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Crear el mapa centrado en Colombia
        const map = L.map(mapRef.current).setView([4.5709, -74.2973], 6);

        // Agregar tiles de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current || !locations.length) return;

        const map = mapInstanceRef.current;

        // Limpiar marcadores existentes
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Crear marcadores personalizados
        locations.forEach((location) => {
            // Crear icono personalizado basado en el número de mascotas
            const iconSize = Math.max(30, Math.min(50, 20 + location.count * 0.5));
            
            const customIcon = L.divIcon({
                html: `
                    <div style="
                        background: #ef4444;
                        color: white;
                        border-radius: 50%;
                        width: ${iconSize}px;
                        height: ${iconSize}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${Math.max(10, iconSize * 0.3)}px;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    ">
                        ${location.count}
                    </div>
                `,
                className: 'custom-marker',
                iconSize: [iconSize, iconSize],
                iconAnchor: [iconSize / 2, iconSize / 2],
            });

            // Crear marcador
            const marker = L.marker([location.lat, location.lng], { icon: customIcon })
                .addTo(map);

            // Popup con información
            const popupContent = `
                <div class="p-2">
                    <h3 class="font-bold text-lg text-gray-800">${location.city}</h3>
                    <p class="text-sm text-gray-600">
                        <strong>${location.count}</strong> mascotas disponibles
                    </p>
                    ${location.shelters ? `
                        <p class="text-xs text-gray-500">
                            En ${location.shelters} refugio${location.shelters > 1 ? 's' : ''}
                        </p>
                    ` : ''}
                </div>
            `;

            marker.bindPopup(popupContent);

            // Efecto hover
            marker.on('mouseover', function(this: L.Marker) {
                this.openPopup();
            });
        });

        // Ajustar vista para mostrar todos los marcadores
        if (locations.length > 0) {
            const group = new L.FeatureGroup(
                locations.map(loc => L.marker([loc.lat, loc.lng]))
            );
            map.fitBounds(group.getBounds().pad(0.1));
        }

    }, [locations]);

    return (
        <div 
            ref={mapRef} 
            className={`h-96 w-full rounded-lg overflow-hidden shadow-lg ${className}`}
            style={{ minHeight: '400px' }}
        />
    );
}