'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { BRAND } from '@/lib/brand';

type Props = {
  dest: { lat: number; lng: number; label: string };
  cleaner?: { lat: number; lng: number };
  /** Optional route line (e.g. from Mapbox Directions API). Format: [[lng, lat], ...] */
  routeCoordinates?: [number, number][];
};

export function CleanerMap({ dest, cleaner, routeCoordinates }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    if (!token || !ref.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [dest.lng, dest.lat],
      zoom: 12,
    });

    mapRef.current = map;

    // Job/destination marker
    new mapboxgl.Marker({ color: BRAND.blue })
      .setLngLat([dest.lng, dest.lat])
      .setPopup(new mapboxgl.Popup().setText(dest.label))
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [dest.lat, dest.lng, dest.label]);

  // Cleaner live position: fly to and optional marker
  useEffect(() => {
    if (!mapRef.current || !cleaner) return;
    mapRef.current.flyTo({
      center: [cleaner.lng, cleaner.lat],
      zoom: 13,
      speed: 0.8,
    });
  }, [cleaner?.lat, cleaner?.lng]);

  // Route polyline: draw line when routeCoordinates provided (wire Mapbox Directions API here)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routeCoordinates?.length) return;

    const line: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: routeCoordinates,
    };
    const feature = { type: 'Feature' as const, properties: {}, geometry: line };

    const addOrUpdateRoute = () => {
      if (!map.getSource('route')) {
        map.addSource('route', { type: 'geojson', data: feature });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': BRAND.aqua, 'line-width': 4 },
        });
      } else {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(feature);
      }
    };

    if (map.isStyleLoaded()) addOrUpdateRoute();
    else map.once('load', addOrUpdateRoute);
  }, [routeCoordinates]);

  return (
    <div
      ref={ref}
      className="h-[420px] w-full overflow-hidden rounded-3xl shadow-sm"
    />
  );
}
