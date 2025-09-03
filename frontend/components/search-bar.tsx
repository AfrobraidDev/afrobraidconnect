'use client';
import { useState } from "react";
import { Search, MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Current location");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const popularLocations = [
    "New York",
    "London",
    "Paris",
    "Berlin",
    "Tokyo",
    "Sydney",
    "Los Angeles",
    "Toronto",
  ];

  const handleSearch = () => {
    console.log("Searching for:", {
      query: searchQuery,
      location: selectedLocation,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Any date'
    });
    // Add your search logic here
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
        <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-0 h-6 text-sm font-normal text-gray-700 hover:bg-transparent cursor-pointer w-full sm:w-auto justify-start sm:justify-center"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate max-w-[100px] sm:max-w-[120px]">{selectedLocation}</span>
              <ChevronDown className="h-3 w-3 text-gray-400 ml-auto sm:ml-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search locations..." />
              <CommandList>
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedLocation("Current location");
                      setIsLocationOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Current location
                  </CommandItem>
                  {popularLocations.map((location) => (
                    <CommandItem
                      key={location}
                      onSelect={() => {
                        setSelectedLocation(location);
                        setIsLocationOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {location}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Date Selector */}
      <div className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:border-r border-gray-200">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-0 h-6 text-sm font-normal text-gray-700 hover:bg-transparent cursor-pointer w-full sm:w-auto justify-start sm:justify-center"
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="truncate">
                {selectedDate ? format(selectedDate, 'MMM dd') : 'Any date'}
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400 ml-auto sm:ml-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="cursor-pointer"
            />
            <div className="p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedDate(undefined);
                  setIsCalendarOpen(false);
                }}
              >
                Clear date
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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