"use client";
import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import CustomDatePicker from "./custom-date-picker";
import LocationPicker from "./location-picker";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Current location");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalendarMobileOpen, setIsCalendarMobileOpen] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", {
      query: searchQuery,
      location: selectedLocation,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Any date'
    });
  };

  const handleDateButtonClick = () => {
    if (window.innerWidth < 768) {
      setIsCalendarMobileOpen(true);
    } else {
      setIsCalendarOpen(!isCalendarOpen);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-2xl sm:rounded-full p-2 sm:p-1 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-4xl mx-auto gap-2 sm:gap-0">
      {/* Search Input */}
      <div className="flex-1 w-full sm:w-auto px-3 sm:px-4 py-2 sm:border-r border-gray-200">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for services, products, or businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Location Selector */}
      <div className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:border-r border-gray-200">
        <LocationPicker
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
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
              <Calendar className="h-4 w-4 text-gray-400" />
              {selectedDate ? format(selectedDate, "MMM dd") : "Any date"}
            </Button>
          </PopoverTrigger>

          {/* Desktop only */}
          {!isCalendarMobileOpen && (
            <PopoverContent className="w-auto p-0" align="start">
              <CustomDatePicker
                selectedDate={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setIsCalendarOpen(false); }}
                onCancel={() => setIsCalendarOpen(false)}
              />
            </PopoverContent>
          )}
        </Popover>

        {/* Mobile modal */}
        {isCalendarMobileOpen && (
          <CustomDatePicker
            selectedDate={selectedDate}
            onSelect={(date) => { setSelectedDate(date); setIsCalendarMobileOpen(false); }}
            onCancel={() => setIsCalendarMobileOpen(false)}
            isMobileOpen={isCalendarMobileOpen}
            setIsMobileOpen={setIsCalendarMobileOpen}
          />
        )}
      </div>

      {/* Search Button */}
      <div className="w-full sm:w-auto px-2">
        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto rounded-xl sm:rounded-full bg-[#D0865A] hover:bg-[#BF764A] text-white px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
