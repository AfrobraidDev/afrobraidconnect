"use client";
import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { BiLoaderCircle } from "react-icons/bi"

interface LocationPickerProps {
    selectedLocation: string;
    setSelectedLocation: (loc: string) => void;
}

const LocationPicker = ({ selectedLocation, setSelectedLocation }: LocationPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSelectedLocation(`Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
                    setIsOpen(false);
                },
                (error) => {
                    console.error(error);
                    alert("Unable to get current location.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    // Handle typing loader logic
    const handleTyping = (value: string) => {
        setManualInput(value);
        setIsTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1000); // stops typing after 1s idle
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center justify-between w-full sm:w-auto px-3 py-2 text-left text-sm font-normal rounded-sm hover:shadow-sm transition shadow-none border-none cursor-pointer text-gray-800"
                >
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        {selectedLocation || "Select Location"}
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4 rounded-xl">
                {/* Current Location */}
                <div
                    onClick={handleCurrentLocation}
                    className="flex items-center justify-between p-2 rounded-sm hover:bg-gray-100 cursor-pointer"
                >
                    <span className="text-[#D0865A] text-lg font-medium">Use current location</span>
                    <span className="text-[#D0865A] transform rotate-45 text-lg">▶</span>
                </div>

                {/* Live typing display */}
                {manualInput && (
                    <div
                        onClick={() => {
                            setSelectedLocation(manualInput);
                            setIsOpen(false);
                        }}
                        className="flex items-center justify-between mt-3 p-2 bg-gray-50 rounded-sm cursor-pointer"
                    >
                        <span className="text-gray-700">{manualInput}</span>
                        {isTyping && (
                            <BiLoaderCircle className="h-4 w-4 text-[#D0865A] animate-[spin_2s_linear_infinite]" />
                        )}
                    </div>
                )}

                {/* Manual input */}
                <div className="mt-3">
                    <input
                        type="text"
                        placeholder="Enter location manually"
                        className="w-full p-2 text-lg border border-gray-300 rounded-sm focus:outline-none"
                        value={manualInput}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSelectedLocation(manualInput);
                                setIsOpen(false);
                            }
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default LocationPicker;
