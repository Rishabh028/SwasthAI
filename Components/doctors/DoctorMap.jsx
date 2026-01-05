import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DoctorMap({ doctor }) {
  const position = [doctor.latitude || 28.6139, doctor.longitude || 77.2090];

  return (
    <div className="h-64 rounded-xl overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Dr. {doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.hospital_name}</p>
              <p className="text-xs text-gray-500">{doctor.location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}