"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import ResultCard from "./result-card";
import { searchBraiders, getServiceTypes } from "./api/search";
import {
  Loader2,
  SlidersHorizontal,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

function SearchContent() {
  const searchParams = useSearchParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const query = searchParams.get("q") || "";
  const locationName = searchParams.get("locationName") || "";
  const dateParam = searchParams.get("date");

  const [radius, setRadius] = useState([50]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data: serviceTypesData } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => {
      const res = await getServiceTypes();
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const serviceTypes = serviceTypesData || [];

  const {
    data: results = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      "searchBraiders",
      { lat, lng, query, dateParam, radius: radius[0], selectedServiceType },
    ],
    queryFn: async () => {
      if (!lat || !lng) return [];

      const datetime = dateParam ? `${dateParam}T09:00:00` : undefined;
      const radiusMeters = radius[0] * 1000;

      const response = await searchBraiders({
        lat,
        lng,
        searchTerm: query,
        datetime,
        radius: radiusMeters,
        service_type_id:
          selectedServiceType !== "all" ? selectedServiceType : undefined,
      });

      return response?.data?.results || [];
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: !!(lat && lng),
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="hidden md:block">
            <SearchBar
              initialQuery={query}
              initialLocationName={locationName}
              initialLat={lat}
              initialLng={lng}
              initialDate={dateParam || undefined}
            />
          </div>

          <div className="md:hidden">
            <Sheet
              open={isMobileFilterOpen}
              onOpenChange={setIsMobileFilterOpen}
            >
              <SheetTrigger asChild>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50 transition-colors cursor-pointer">
                  <div className="bg-[#D0865A] h-10 w-10 flex items-center justify-center rounded-lg text-white shadow-sm shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="font-semibold text-gray-900 truncate text-sm">
                      {query || "Where to?"}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-3 truncate mt-0.5">
                      <span className="flex items-center gap-1 truncate max-w-[50%]">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {locationName || "Anywhere"}
                      </span>
                      <div className="w-[1px] h-3 bg-gray-300"></div>
                      <span className="flex items-center gap-1 truncate">
                        <CalendarIcon className="w-3 h-3 text-gray-400" />
                        {dateParam
                          ? format(new Date(dateParam), "MMM d")
                          : "Any Date"}
                      </span>
                    </div>
                  </div>
                </div>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="flex flex-col h-[90vh] sm:h-[85vh] p-0 rounded-t-2xl gap-0"
              >
                <SheetHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
                  <SheetTitle className="text-lg font-bold text-gray-900">
                    Filters & Search
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Search Criteria
                      </h3>
                      <SearchBar
                        initialQuery={query}
                        initialLocationName={locationName}
                        initialLat={lat}
                        initialLng={lng}
                        initialDate={dateParam || undefined}
                        className="bg-gray-50 border-gray-200 shadow-none !rounded-xl !p-3 flex-col gap-3"
                      />
                    </div>

                    <div className="h-[1px] bg-gray-100 w-full my-6"></div>
                    <div className="space-y-6">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Refine Results
                      </h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Service Type
                        </label>
                        <Select
                          value={selectedServiceType}
                          onValueChange={setSelectedServiceType}
                        >
                          <SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {serviceTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            Distance Radius
                          </label>
                          <span className="text-xs font-bold text-[#D0865A] bg-[#D0865A]/10 px-2 py-1 rounded-md">
                            {radius} km
                          </span>
                        </div>
                        <Slider
                          value={radius}
                          onValueChange={setRadius}
                          max={200}
                          step={1}
                          className="py-2 cursor-grab active:cursor-grabbing"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                          <span>1km</span>
                          <span>200km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SheetFooter className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 pb-8 sm:pb-4">
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setRadius([50]);
                        setSelectedServiceType("all");
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-[2] h-12 rounded-xl bg-[#D0865A] hover:bg-[#bf764a] text-white shadow-md shadow-orange-500/20 font-semibold text-base"
                      onClick={() => setIsMobileFilterOpen(false)}
                    >
                      {isFetching
                        ? "Updating..."
                        : `Show ${results.length} Results`}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-medium">Filters:</span>
            </div>

            <Select
              value={selectedServiceType}
              onValueChange={setSelectedServiceType}
            >
              <SelectTrigger className="w-[200px] h-9 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Types</SelectItem>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-4 bg-gray-50 px-4 py-1.5 rounded-md border border-gray-200 min-w-[250px]">
              <span className="text-gray-600 whitespace-nowrap">
                Radius: {radius} km
              </span>
              <Slider
                value={radius}
                onValueChange={setRadius}
                max={200}
                step={1}
                className="w-full cursor-pointer"
              />
            </div>

            {isFetching && (
              <div className="ml-auto text-xs text-[#D0865A] flex items-center gap-2 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Updating results...
              </div>
            )}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#D0865A] animate-spin mb-4" />
            <p className="text-gray-500">Finding best braiders near you...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6 px-1 flex items-center gap-2">
              Found {results.length} braiders near you
            </h2>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
                isFetching ? "opacity-70" : "opacity-100"
              }`}
            >
              {results.map((braider) => (
                <ResultCard key={braider.id} data={braider} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 mx-4">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">
              No braiders found
            </h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto px-4">
              We couldn't find any braiders matching your criteria. Try
              increasing the search radius or selecting a different date.
            </p>
            <Button
              onClick={() => setRadius([200])}
              variant="link"
              className="mt-4 text-[#D0865A]"
            >
              Expand radius to 200km
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">Loading search result...</div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
