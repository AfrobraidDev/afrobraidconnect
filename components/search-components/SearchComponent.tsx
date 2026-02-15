"use client";

import { useState, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import ResultCard from "./result-card";
import { searchBraiders, getBraidingSkills } from "./api/search";
import { BraiderResult } from "./types/search";
import {
  Loader2,
  SlidersHorizontal,
  Map as MapIcon,
  List as ListIcon,
  Star,
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
  },
);

function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Primary Search Params
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const query = searchParams.get("q") || "";
  const locationName = searchParams.get("locationName") || "";
  const dateParam = searchParams.get("date");

  // Filter States initialized from URL params
  const [radius, setRadius] = useState([50]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get("skills")?.split(",").filter(Boolean) || [],
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "0");

  // UI States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedBraider, setSelectedBraider] = useState<BraiderResult | null>(
    null,
  );

  // Helper to sync state to URL
  const updateURLParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Fetch Skills
  const { data: skillsData } = useQuery({
    queryKey: ["braidingSkills"],
    queryFn: async () => {
      const res = await getBraidingSkills();
      return Array.isArray(res.data?.results) ? res.data.results : [];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const skills = skillsData || [];

  // Fetch Search Results
  const {
    data: results = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      "searchBraiders",
      {
        lat,
        lng,
        query,
        dateParam,
        radius: radius[0],
        selectedSkills,
        minPrice,
        maxPrice,
        rating,
      },
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
        skills:
          selectedSkills.length > 0 ? selectedSkills.join(",") : undefined,
        min_price: minPrice ? parseInt(minPrice) : undefined,
        max_price: maxPrice ? parseInt(maxPrice) : undefined,
        rating: rating !== "0" ? parseFloat(rating) : undefined,
      });

      return response?.data?.results || [];
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: !!(lat && lng),
  });

  // Toggle Function for Multi-Select + URL sync
  const toggleSkill = (id: string) => {
    const updatedSkills = selectedSkills.includes(id)
      ? selectedSkills.filter((skillId) => skillId !== id)
      : [...selectedSkills, id];

    setSelectedSkills(updatedSkills);
    updateURLParams({
      skills: updatedSkills.length > 0 ? updatedSkills.join(",") : null,
    });
  };

  // Handle URL sync on input blur (UX: prevents URL spam while typing)
  const handlePriceBlur = () => {
    updateURLParams({
      min_price: minPrice || null,
      max_price: maxPrice || null,
    });
  };

  const handleRatingChange = (val: string) => {
    setRating(val);
    updateURLParams({ rating: val !== "0" ? val : null });
  };

  const clearFilters = () => {
    setRadius([50]);
    setSelectedSkills([]);
    setMinPrice("");
    setMaxPrice("");
    setRating("0");
    updateURLParams({
      skills: null,
      min_price: null,
      max_price: null,
      rating: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col h-screen overflow-hidden">
      <style jsx global>{`
        .pac-container {
          z-index: 10000 !important;
          position: fixed !important;
          pointer-events: auto !important;
        }
        .rdp-v2,
        [data-radix-portal] {
          z-index: 10000 !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* HEADER */}
      <div className="bg-white border-b z-30 shadow-sm shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          {/* DESKTOP HEADER & SEARCH */}
          <div className="hidden md:flex flex-col gap-4">
            <SearchBar
              initialQuery={query}
              initialLocationName={locationName}
              initialLat={lat}
              initialLng={lng}
              initialDate={dateParam || undefined}
            />

            {/* DESKTOP SKILLS CHIPS ROW */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 border-b border-gray-100 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase shrink-0 mr-2">
                Skills
              </span>
              {skills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    selectedSkills.includes(skill.id)
                      ? "bg-[#D0865A] border-[#D0865A] text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>

            {/* DESKTOP SECONDARY FILTERS ROW */}
            <div className="flex flex-wrap items-center gap-4 text-sm w-full">
              <div className="flex items-center gap-2 text-gray-500 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium">Filters:</span>
              </div>

              {/* Rating Select */}
              <Select value={rating} onValueChange={handleRatingChange}>
                <SelectTrigger className="w-[160px] h-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5 & up</SelectItem>
                  <SelectItem value="4.0">4.0 & up</SelectItem>
                  <SelectItem value="3.0">3.0 & up</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range Inline */}
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 shrink-0">
                <span className="text-gray-500 pl-1">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={handlePriceBlur}
                  className="w-14 bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
                <span className="text-gray-300">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={handlePriceBlur}
                  className="w-14 bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
              </div>

              {/* Distance Slider */}
              <div className="flex items-center gap-4 bg-gray-50 px-4 py-1.5 rounded-md border border-gray-200 min-w-[200px] shrink-0">
                <span className="text-gray-600 whitespace-nowrap">
                  {radius} km
                </span>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  max={200}
                  step={1}
                  className="w-full cursor-pointer"
                />
              </div>

              <div className="ml-auto flex items-center gap-4 shrink-0">
                {isFetching && (
                  <div className="text-xs text-[#D0865A] flex items-center gap-2 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> Updating...
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

          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center gap-2 w-full">
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
                    {/* Search Component inside Mobile sheet */}
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

                      {/* MOBILE SKILLS MULTI-SELECT */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                          Braiding Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <button
                              key={skill.id}
                              onClick={() => toggleSkill(skill.id)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                                selectedSkills.includes(skill.id)
                                  ? "bg-[#D0865A] border-[#D0865A] text-white shadow-sm"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {skill.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* MOBILE PRICE RANGE */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                          Price Range
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-3 h-12">
                            <span className="text-gray-500 font-medium mr-2">
                              $
                            </span>
                            <input
                              type="number"
                              placeholder="Min Price"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              onBlur={handlePriceBlur}
                              className="w-full bg-transparent outline-none text-gray-900"
                            />
                          </div>
                          <span className="text-gray-400 font-bold">-</span>
                          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-3 h-12">
                            <span className="text-gray-500 font-medium mr-2">
                              $
                            </span>
                            <input
                              type="number"
                              placeholder="Max Price"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              onBlur={handlePriceBlur}
                              className="w-full bg-transparent outline-none text-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* MOBILE RATING CHIPS */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                          Minimum Rating
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["0", "3.0", "4.0", "4.5"].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleRatingChange(val)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 border ${
                                rating === val
                                  ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {val === "0" ? "Any Rating" : `${val} & up`}
                              {val !== "0" && (
                                <Star className="w-3.5 h-3.5 fill-current" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* MOBILE DISTANCE */}
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
                      onClick={clearFilters}
                    >
                      Clear All
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
                    Try increasing the search radius or changing filters.
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                    <Button
                      onClick={() => setRadius([200])}
                      className="bg-[#D0865A] hover:bg-[#bf764a] text-white"
                    >
                      Expand radius
                    </Button>
                  </div>
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
