"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BraiderResult } from "./types/search";

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="
    background-color: #3b82f6; 
    width: 16px; 
    height: 16px; 
    border-radius: 50%; 
    border: 3px solid white; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const createBraiderIcon = (logoUrl: string | null) => {
  const imageSrc = logoUrl || "/images/afro-connect.png";

  return L.divIcon({
    className: "braider-marker",
    html: `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
      ">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #D0865A;
        "></div>
        <div style="
          width: 40px; 
          height: 40px; 
          background-image: url('${imageSrc}');
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          border: 3px solid #D0865A;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          margin: 0 auto;
          margin-bottom: 6px;
        "></div>
      </div>
    `,
    iconSize: [48, 56],
    iconAnchor: [24, 56],
  });
};

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 12, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

interface SearchMapProps {
  userLat: number;
  userLng: number;
  braiders: BraiderResult[];
  onMarkerClick: (braider: BraiderResult) => void;
  radiusKm: number;
}

export default function SearchMap({
  userLat,
  userLng,
  braiders,
  onMarkerClick,
  radiusKm,
}: SearchMapProps) {
  return (
    <div className="w-full h-full bg-gray-100">
      <MapContainer
        center={[userLat, userLng]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter lat={userLat} lng={userLng} />

        <Marker position={[userLat, userLng]} icon={userIcon} />

        <Circle
          center={[userLat, userLng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: "#D0865A",
            fillColor: "#D0865A",
            fillOpacity: 0.05,
            weight: 1,
            dashArray: "5, 10",
          }}
        />

        {braiders.map((braider) =>
          braider.locations.map((loc) => (
            <Marker
              key={`${braider.id}-${loc.id}`}
              position={[loc.latitude, loc.longitude]}
              icon={createBraiderIcon(braider.business_logo_url)}
              eventHandlers={{
                click: () => onMarkerClick(braider),
              }}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
}
