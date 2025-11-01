import { useState, useRef, useEffect } from "react";
import { Loader2, MapPin } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

interface MapaUbicacionProps {
  latitud: number | string;
  longitud: number | string;
  direccion?: string;
  titulo?: string;
  className?: string;
}

const MapaUbicacion = ({
  latitud,
  longitud,
  direccion,
  titulo = "Ubicación del pedido",
  className = "w-full h-64 rounded-lg",
}: MapaUbicacionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const safeParseFloat = (
    value: string | number | null | undefined
  ): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setLoadError(true);
      return;
    }

    if (window.google) {
      setMapLoaded(true);
      return;
    }

    if (window.googleMapsLoaded) {
      return;
    }

    window.googleMapsLoaded = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setLoadError(true);
      window.googleMapsLoaded = false;
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;

    const lat = safeParseFloat(latitud);
    const lng = safeParseFloat(longitud);

    if (!lat || !lng) {
      setLoadError(true);
      return;
    }

    const initialLocation = { lat, lng };

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 15,
        streetViewControl: true,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      markerRef.current = new window.google.maps.Marker({
        position: initialLocation,
        map: mapInstanceRef.current,
        draggable: false,
        title: titulo,
        animation: window.google.maps.Animation.DROP,
      });

      if (direccion) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${titulo}</h3>
              <p class="text-xs text-gray-600 mt-1">${direccion}</p>
              <p class="text-xs text-gray-500 mt-1">
                Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}
              </p>
            </div>
          `,
        });

        markerRef.current.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, markerRef.current);
        });
      }
    } catch (error) {
      setLoadError(true);
    }
  }, [mapLoaded, latitud, longitud, direccion, titulo]);

  const abrirEnGoogleMaps = () => {
    const lat = safeParseFloat(latitud);
    const lng = safeParseFloat(longitud);

    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  if (loadError) {
    return (
      <div
        className={`${className} bg-gray-100 flex flex-col items-center justify-center`}
      >
        <MapPin className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-gray-600 text-center text-sm">
          No se pudo cargar el mapa
          <br />
          de la ubicación
        </span>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={mapRef} className={className} />
      <button
        onClick={abrirEnGoogleMaps}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Abrir en Google Maps
      </button>
    </div>
  );
};

export default MapaUbicacion;
