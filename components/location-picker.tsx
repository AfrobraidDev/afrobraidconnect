"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { BiLoaderCircle } from "react-icons/bi";
import { useLoadScript, Libraries } from "@react-google-maps/api";

interface LocationPickerProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  setCoordinates: (coords: { lat: number; lng: number } | null) => void;
}

const LocationPicker = ({
  selectedLocation,
  setSelectedLocation,
  setCoordinates,
}: LocationPickerProps) => {
  const libraries = useMemo<Libraries>(() => ["places"], []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      setManualInput(selectedLocation);
    } else {
      setManualInput("");
    }
  }, [selectedLocation]);

  const inputRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node && isLoaded) {
        if (autoCompleteRef.current) {
          google.maps.event.clearInstanceListeners(autoCompleteRef.current);
        }

        autoCompleteRef.current = new google.maps.places.Autocomplete(node, {
          fields: ["formatted_address", "geometry", "name"],
          types: ["geocode", "establishment"],
        });

        autoCompleteRef.current.addListener("place_changed", () => {
          const place = autoCompleteRef.current?.getPlace();

          if (place && place.geometry && place.geometry.location) {
            const address = place.formatted_address || place.name || "";
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setManualInput(address);
            setSelectedLocation(address);
            setCoordinates({ lat, lng });
            setIsOpen(false);
          }
        });
      }
    },
    [isLoaded, setSelectedLocation, setCoordinates]
  );

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsTyping(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (isLoaded) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsTyping(false);
              if (status === "OK" && results && results[0]) {
                const address = results[0].formatted_address;
                setSelectedLocation(address);
                setCoordinates({ lat: latitude, lng: longitude });
                setIsOpen(false);
              } else {
                const coords = `Lat: ${latitude.toFixed(
                  4
                )}, Lng: ${longitude.toFixed(4)}`;
                setSelectedLocation(coords);
                setCoordinates({ lat: latitude, lng: longitude });
                setIsOpen(false);
              }
            }
          );
        }
      },
      (error) => {
        console.error(error);
        setIsTyping(false);
        alert("Unable to get current location.");
      }
    );
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLocation("");
    setManualInput("");
    setCoordinates(null);
  };

  if (loadError)
    return <div className="text-red-500 text-xs">Error loading maps</div>;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center justify-between w-full sm:w-auto px-3 py-2 text-left text-sm font-normal rounded-sm hover:shadow-sm transition shadow-none border-none cursor-pointer text-gray-800"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {selectedLocation || "Select Location"}
            </span>
          </div>

          {selectedLocation && (
            <div
              role="button"
              onClick={handleClear}
              className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
              title="Clear location"
            >
              <X className="h-4 w-4" />
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 rounded-xl" align="start">
        <div
          onClick={handleCurrentLocation}
          className="flex items-center justify-between p-2 rounded-sm hover:bg-gray-100 cursor-pointer mb-2"
        >
          <span className="text-[#D0865A] text-lg font-medium">
            Use current location
          </span>
          {isTyping ? (
            <BiLoaderCircle className="h-5 w-5 text-[#D0865A] animate-spin" />
          ) : (
            <span className="text-[#D0865A] transform rotate-45 text-lg">
              ▶
            </span>
          )}
        </div>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={isLoaded ? "Search places..." : "Loading Maps..."}
            className="w-full p-2 text-lg border border-gray-300 rounded-sm focus:outline-none"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            disabled={!isLoaded}
            autoComplete="new-password"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationPicker;
