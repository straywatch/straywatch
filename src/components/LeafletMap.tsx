import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from 'react-leaflet';
import type { Report } from '@/lib/supabase';
import { LEH_CENTER, DEFAULT_ZOOM, REPORT_COLORS, REPORT_LABELS, getMarkerRadius, formatDate } from '@/lib/utils';
import { useUIStore } from '@/lib/store';

interface LeafletMapProps {
  reports: Report[];
  selectMode?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

function LocationSelector({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapController({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 16);
    }
  }, [center, map]);
  
  return null;
}

export function LeafletMap({ reports, selectMode = false, onLocationSelect }: LeafletMapProps) {
  const { selectedLocation } = useUIStore();
  const mapRef = useRef(null);

  return (
    <MapContainer
      ref={mapRef}
      center={[LEH_CENTER.lat, LEH_CENTER.lng]}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {selectMode && <LocationSelector onLocationSelect={onLocationSelect} />}
      <MapController center={selectedLocation} />
      
      {selectedLocation && selectMode && (
        <CircleMarker
          center={[selectedLocation.lat, selectedLocation.lng]}
          radius={12}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.6,
            weight: 3,
          }}
        >
          <Popup>
            <div className="text-center">
              <p className="font-medium">Selected Location</p>
              <p className="text-sm text-gray-500">
                {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      )}
      
      {!selectMode && reports.map((report) => (
        <CircleMarker
          key={report.id}
          center={[report.lat, report.lng]}
          radius={getMarkerRadius(report.count)}
          pathOptions={{
            color: REPORT_COLORS[report.type],
            fillColor: REPORT_COLORS[report.type],
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <div 
                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white mb-2"
                style={{ backgroundColor: REPORT_COLORS[report.type] }}
              >
                {REPORT_LABELS[report.type]}
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Count:</span> {report.count}</p>
                {report.severity && (
                  <p><span className="font-medium">Severity:</span> {report.severity}</p>
                )}
                {report.notes && (
                  <p><span className="font-medium">Notes:</span> {report.notes}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  {formatDate(report.created_at)}
                </p>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
