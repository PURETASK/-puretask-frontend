'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string }>;
  className?: string;
  height?: string;
  showDirections?: boolean;
  destination?: { lat: number; lng: number };
}

export function MapView({
  lat,
  lng,
  zoom = 15,
  markers = [],
  className,
  height = '400px',
  showDirections = false,
  destination,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Using static map fallback.');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [lat, lng, zoom, markers]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    // Add markers
    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        label: marker.label,
      });
    });

    // Add directions if destination provided
    if (showDirections && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: { lat, lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }
  };

  // Fallback: Static map or placeholder
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},${zoom}/400x400?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}`;
    
    return (
      <div className={cn('relative bg-gray-200 rounded-lg overflow-hidden', className)} style={{ height }}>
        {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
          <img src={staticMapUrl} alt="Map" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Map unavailable</p>
              <p className="text-xs">Configure Google Maps or Mapbox API key</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={cn('rounded-lg overflow-hidden border border-gray-200', className)}
      style={{ height }}
      aria-label="Interactive map"
    />
  );
}

// Declare Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}
