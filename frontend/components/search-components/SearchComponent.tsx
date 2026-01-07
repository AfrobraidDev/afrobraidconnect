"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import ResultCard from "./result-card";
import { searchBraiders, getServiceTypes } from "./api/search";
import { BraiderResult } from "./types/search";
import {
  Loader2,
  SlidersHorizontal,
  Map as MapIcon,
  List as ListIcon,
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

const SearchMap = dynamic(
  () => import("@/components/search-components/search-map"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
        Loading Map...
      </div>
    ),
  }
);

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
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedBraider, setSelectedBraider] = useState<BraiderResult | null>(
    null
  );

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
    <div className="min-h-screen bg-gray-50 relative flex flex-col h-screen overflow-hidden">
      <style jsx global>{`
        .pac-container {
          z-index: 10000 !important; /* Above everything */
          position: fixed !important;
          pointer-events: auto !important;
        }
        .rdp-v2 {
          z-index: 10000 !important;
        }
        /* Ensure Dialog/Popover overlays inside the Sheet are visible */
        [data-radix-portal] {
          z-index: 10000 !important;
        }
      `}</style>

      {/* HEADER */}
      <div className="bg-white border-b z-30 shadow-sm shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          {/* DESKTOP HEADER */}
          <div className="hidden md:block">
            <SearchBar
              initialQuery={query}
              initialLocationName={locationName}
              initialLat={lat}
              initialLng={lng}
              initialDate={dateParam || undefined}
            />
          </div>

          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center gap-2 w-full">
            {/* 1. SEARCH TRIGGER */}
            <Sheet
              open={isMobileFilterOpen}
              onOpenChange={setIsMobileFilterOpen}
            >
              <SheetTrigger asChild>
                <div className="flex-1 flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 active:bg-gray-100 transition-colors cursor-pointer h-14 overflow-hidden">
                  <div className="bg-white h-10 w-10 flex items-center justify-center rounded-lg text-[#D0865A] border border-gray-100 shadow-sm shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="font-bold text-gray-900 truncate text-sm leading-tight">
                      {query || "Where to?"}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-2 truncate mt-0.5">
                      <span className="truncate max-w-[100px]">
                        {locationName || "Anywhere"}
                      </span>
                      {dateParam && (
                        <>
                          <div className="w-[1px] h-3 bg-gray-300"></div>
                          <span className="truncate">
                            {format(new Date(dateParam), "MMM d")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="flex flex-col h-[90vh] sm:h-[85vh] p-0 rounded-t-2xl gap-0 z-[50]"
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
                          <SelectContent className="z-[60]">
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
                      className="flex-[2] h-12 rounded-xl bg-[#D0865A] hover:bg-[#bf764a] text-white shadow-md font-semibold text-base"
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

            {/* 2. MOBILE VIEW TOGGLE BUTTON */}
            <button
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className="h-14 w-14 shrink-0 flex flex-col items-center justify-center bg-gray-900 text-white rounded-xl shadow-md active:scale-95 transition-transform border border-gray-800"
            >
              {viewMode === "list" ? (
                <MapIcon className="w-6 h-6" />
              ) : (
                <ListIcon className="w-6 h-6" />
              )}
              <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wide">
                {viewMode === "list" ? "Map" : "List"}
              </span>
            </button>
          </div>

          {/* DESKTOP FILTERS ROW */}
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
            <div className="ml-auto flex items-center gap-4">
              {isFetching && (
                <div className="text-xs text-[#D0865A] flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Updating
                  results...
                </div>
              )}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <ListIcon className="w-4 h-4" /> List
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "map"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <MapIcon className="w-4 h-4" /> Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === "list" ? (
          <main className="h-full overflow-y-auto pb-24">
            <div className="max-w-7xl mx-auto px-4 py-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#D0865A] animate-spin mb-4" />
                  <p className="text-gray-500">
                    Finding best braiders near you...
                  </p>
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
                      <ResultCard
                        key={braider.id}
                        data={braider}
                        dateParam={dateParam}
                      />
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
                    We couldn&apos;t find any braiders matching your criteria.
                    Try increasing the search radius.
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
            </div>
          </main>
        ) : (
          <div className="w-full h-full relative">
            <SearchMap
              userLat={lat}
              userLng={lng}
              braiders={results}
              onMarkerClick={setSelectedBraider}
              radiusKm={radius[0]}
            />
          </div>
        )}
      </div>

      <Sheet
        open={!!selectedBraider}
        onOpenChange={() => setSelectedBraider(null)}
      >
        <SheetContent
          side="bottom"
          className="p-0 rounded-t-2xl z-[60] bg-transparent border-0 shadow-none"
        >
          <SheetTitle className="sr-only">Braider Details</SheetTitle>
          <div className="bg-white p-4 pb-8 rounded-t-2xl shadow-2xl max-w-lg mx-auto">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
            {selectedBraider && (
              <ResultCard data={selectedBraider} dateParam={dateParam} />
            )}
          </div>
        </SheetContent>
      </Sheet>
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
