'use client';

import React, { useEffect, useRef } from 'react';
import { EVStation } from '../types/ev';

interface RealMapProps {
  stations: EVStation[];
  selectedStationId?: string;
  onSelectStation: (station: EVStation) => void;
  onBookStation: (station: EVStation) => void;
  showGridLines?: boolean;
}

export const RealMap: React.FC<RealMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  onBookStation,
  showGridLines = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default icon urls
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
      });

      // Initialize map instance centered on Metro region
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [37.7650, -122.4150],
          zoom: 12,
          scrollWheelZoom: true,
          zoomControl: true
        });

        // Add CartoDB Positron Light Tiles (Ultra clean B&W)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing layers
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];
      polylinesRef.current.forEach(p => map.removeLayer(p));
      polylinesRef.current = [];

      // Substation coordinates
      const substations = [
        { id: 'TX-101', name: 'TX-101 Downtown Core', lat: 37.7800, lng: -122.4100 },
        { id: 'TX-104', name: 'TX-104 Solar Grid', lat: 37.7400, lng: -122.4300 }
      ];

      // Draw Grid Polylines
      if (showGridLines) {
        stations.forEach(st => {
          const sub = substations.find(s => s.id === st.gridTransformerId) || substations[0];
          const line = L.polyline([[sub.lat, sub.lng], [st.lat, st.lng]], {
            color: '#000000',
            weight: 2,
            dashArray: '5, 5',
            opacity: 0.5
          }).addTo(map);
          polylinesRef.current.push(line);
        });

        // Substation Markers
        substations.forEach(sub => {
          const subIcon = L.divIcon({
            className: 'custom-substation-pin',
            html: `
              <div style="
                background: #000000;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 8px;
                font-weight: 800;
                font-size: 10px;
                border: 2px solid #ffffff;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                white-space: nowrap;
                font-family: monospace;
              ">
                ⚡ ${sub.name}
              </div>
            `,
            iconSize: [110, 24],
            iconAnchor: [55, 12]
          });
          const marker = L.marker([sub.lat, sub.lng], { icon: subIcon }).addTo(map);
          markersRef.current.push(marker);
        });
      }

      // Compact Non-Overlapping Station Markers (Campus Flow Style)
      stations.forEach(st => {
        const isSelected = selectedStationId === st.id;
        const iconSymbol = st.category === 'SolarMicrogrid' ? '☀️' : st.category === 'Superhub' ? '⚡' : '🏎️';

        const customMarkerIcon = L.divIcon({
          className: 'custom-compact-ev-marker',
          html: `
            <div style="
              position: relative;
              background-color: ${isSelected ? '#000000' : '#ffffff'};
              color: ${isSelected ? '#ffffff' : '#000000'};
              border: 2px solid #000000;
              border-radius: 12px;
              width: 38px;
              height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.18);
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: all 0.2s ease-in-out;
            " title="${st.name}">
              ${iconSymbol}
              <span style="
                position: absolute;
                top: -6px;
                right: -6px;
                background-color: #000000;
                color: #ffffff;
                border: 1px solid #ffffff;
                border-radius: 9999px;
                font-size: 9px;
                font-weight: 900;
                font-family: monospace;
                padding: 1px 4px;
                line-height: 1;
              ">${st.availablePorts}</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const marker = L.marker([st.lat, st.lng], { icon: customMarkerIcon }).addTo(map);

        marker.on('click', () => {
          onSelectStation(st);
        });

        // Popup Container
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 font-sans space-y-2';
        popupContent.style.cssText = 'min-width: 180px; font-family: system-ui, sans-serif;';
        popupContent.innerHTML = `
          <div style="font-weight: 900; font-size: 13px; color: #000; leading-tight;">${st.name}</div>
          <div style="font-size: 11px; color: #525252; margin-top: 2px;">${st.address}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; font-family: monospace; border-top: 1px solid #e5e5e5; padding-top: 6px; margin-top: 6px;">
            <span>Rate: $${st.currentTariff}/kWh</span>
            <span>Wait: ${st.waitingTimeMins}m</span>
          </div>
        `;

        const btn = document.createElement('button');
        btn.innerText = 'Reserve Slot';
        btn.style.cssText = 'width: 100%; margin-top: 8px; background: #000; color: #fff; border: none; border-radius: 8px; padding: 7px 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; cursor: pointer; letter-spacing: 0.05em;';
        btn.onclick = () => onBookStation(st);
        popupContent.appendChild(btn);

        marker.bindPopup(popupContent, { maxWidth: 220 });

        markersRef.current.push(marker);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [stations, selectedStationId, showGridLines]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl border border-neutral-300 overflow-hidden shadow-sm bg-neutral-100">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
