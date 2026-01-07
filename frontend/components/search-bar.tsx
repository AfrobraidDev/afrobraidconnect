"use client";

import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import CustomDatePicker from "./custom-date-picker";
import LocationPicker from "./location-picker";
import { useRouter, useParams } from "next/navigation";
import SearchValidationModal from "@/components/search-validation-modal";

// Define Props Interface
interface SearchBarProps {
  initialQuery?: string;
  initialLocationName?: string;
  initialLat?: number;
  initialLng?: number;
  initialDate?: string;
  className?: string;
}

export function SearchBar({
  initialQuery = "",
  initialLocationName = "",
  initialLat,
  initialLng,
  initialDate,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const params = useParams();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocationName);

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? parseISO(initialDate) : undefined
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalendarMobileOpen, setIsCalendarMobileOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialLocationName) setSelectedLocation(initialLocationName);
    if (initialLat && initialLng)
      setCoordinates({ lat: initialLat, lng: initialLng });
    if (initialDate) setSelectedDate(parseISO(initialDate));
  }, [initialQuery, initialLocationName, initialLat, initialLng, initialDate]);

  const handleSearch = () => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      setErrorMessage(
        "Please select a valid location from the list or use your current location."
      );
      setErrorModalOpen(true);
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Please select a date for your appointment.");
      setErrorModalOpen(true);
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const locale = params?.locale || "en";

    const queryParams = new URLSearchParams({
      q: searchQuery,
      locationName: selectedLocation,
      lat: coordinates.lat.toString(),
      lng: coordinates.lng.toString(),
      date: formattedDate,
    });

    router.push(`/${locale}/search?${queryParams.toString()}`);
  };

  const handleDateButtonClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsCalendarMobileOpen(true);
    } else {
      setIsCalendarOpen(!isCalendarOpen);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-2xl sm:rounded-full p-2 sm:p-1 shadow-sm hover:shadow-md transition-shadow duration-300 w-full gap-2 sm:gap-0 ${className}`}
      >
        {/* Search Input */}
        <div className="flex-1 w-full sm:w-auto px-3 sm:px-4 py-2 sm:border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <Input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-sm sm:text-base w-full"
            />
          </div>
        </div>

        {/* Location Selector */}
        <div className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:border-r border-gray-200">
          <LocationPicker
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setCoordinates={setCoordinates}
          />
        </div>

        {/* Date Selector */}
        <div className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:border-r border-gray-200">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleDateButtonClick}
                className="flex items-center gap-2 p-0 h-6 text-sm font-normal text-gray-700 hover:bg-transparent cursor-pointer w-full sm:w-auto justify-start sm:justify-center"
              >
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">
                  {selectedDate ? format(selectedDate, "MMM dd") : "Date"}
                </span>
              </Button>
            </PopoverTrigger>

            {!isCalendarMobileOpen && (
              <PopoverContent className="w-auto p-0" align="start">
                <CustomDatePicker
                  selectedDate={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  onCancel={() => setIsCalendarOpen(false)}
                />
              </PopoverContent>
            )}
          </Popover>

          {isCalendarMobileOpen && (
            <CustomDatePicker
              selectedDate={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarMobileOpen(false);
              }}
              onCancel={() => setIsCalendarMobileOpen(false)}
              isMobileOpen={isCalendarMobileOpen}
              setIsMobileOpen={setIsCalendarMobileOpen}
            />
          )}
        </div>

        {/* Search Button */}
        <div className="w-full sm:w-auto px-2 pb-2 sm:pb-0">
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto rounded-xl sm:rounded-full bg-[#D0865A] hover:bg-[#BF764A] text-white px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Validation Modal */}
      <SearchValidationModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
    </>
  );
}
