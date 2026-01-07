"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Location } from "./types/braider";
import { useEffect } from "react";

const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapController({
  selectedLocation,
}: {
  selectedLocation: Location | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      const lat = Number(selectedLocation.latitude);
      const lng = Number(selectedLocation.longitude);
      map.flyTo([lat, lng], 14, {
        duration: 1.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
}

export default function BraiderMap({
  locations,
  selectedLocation,
}: {
  locations: Location[];
  selectedLocation: Location | null;
}) {
  const centerLat = locations[0]?.latitude || 6.5244;
  const centerLng = locations[0]?.longitude || 3.3792;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden z-0 isolate">
      <MapContainer
        center={[Number(centerLat), Number(centerLng)]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <MapController selectedLocation={selectedLocation} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc) => {
          const lat = Number(loc.latitude);
          const lng = Number(loc.longitude);
          const isSelected = selectedLocation?.id === loc.id;

          if (loc.service_type === "SHOP_BASED") {
            return (
              <Marker
                key={loc.id}
                position={[lat, lng]}
                icon={defaultIcon}
                zIndexOffset={isSelected ? 1000 : 0}
              >
                <Popup>
                  <div className="font-semibold">📍 Shop Location</div>
                  <div className="text-xs">{loc.address}</div>
                </Popup>
              </Marker>
            );
          }

          return (
            <Circle
              key={loc.id}
              center={[lat, lng]}
              radius={loc.radius_km * 1000}
              pathOptions={{
                color:
                  loc.service_type === "MOBILE_BASED" ? "#D0865A" : "#4CAF50",
                fillColor:
                  loc.service_type === "MOBILE_BASED" ? "#D0865A" : "#4CAF50",
                fillOpacity: isSelected ? 0.4 : 0.2,
                weight: isSelected ? 3 : 1,
              }}
            >
              <Popup>
                <div className="font-semibold">
                  {loc.service_type === "MOBILE_BASED"
                    ? "🚗 Mobile Area"
                    : "🏠 Home Base"}
                </div>
                <div className="text-xs">Radius: {loc.radius_km}km</div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
