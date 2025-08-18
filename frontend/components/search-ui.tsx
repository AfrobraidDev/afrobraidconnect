"use client"

import { useEffect, useState } from 'react';
import { FiClock, FiFilter, FiStar, FiX, FiMapPin, FiNavigation } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

type Treatment = {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  rating: number;
  distance?: number;
};

type Filters = {
  [key: string]: string[];
};

export default function SearchUI() {
  // State for all UI elements
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  // Sample data - replace with your actual data
  const popularSearches = [
    "Hair Salon", "Manicure", "Massage", "Facial", "Waxing", 
    "Eyebrows", "Pedicure", "Barber", "Spa Day", "Hair Color"
  ];
  
  const trendingTreatments: Treatment[] = [
    {
      id: '1',
      name: "Keratin Treatment",
      beforeImage: '/treatments/keratin-before.jpg',
      afterImage: '/treatments/keratin-after.jpg',
      rating: 4.8,
      distance: 1.2
    },
    {
      id: '2',
      name: "Microblading",
      beforeImage: '/treatments/microblading-before.jpg',
      afterImage: '/treatments/microblading-after.jpg',
      rating: 4.9,
      distance: 0.8
    },
    {
      id: '3',
      name: "Acne Facial",
      beforeImage: '/treatments/facial-before.jpg',
      afterImage: '/treatments/facial-after.jpg',
      rating: 4.7,
      distance: 2.5
    }
  ];

  const filters: Filters = {
    "Price Range": ["$", "$$", "$$$", "$$$$"],
    "Rating": ["4+ Stars", "3+ Stars", "New Businesses"],
    "Distance": ["< 1km", "< 5km", "< 10km", "Anywhere"],
    "Availability": ["Today", "Tomorrow", "This Week"]
  };

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Get user location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to retrieve your location");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  // Add search to recent searches
  const addRecentSearch = (query: string) => {
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5); // Keep only 5 most recent
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Remove recent search
  const removeRecentSearch = (query: string) => {
    const updatedSearches = recentSearches.filter(item => item !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main Search Card (existing) would go here */}
      
      {/* Enhanced Search UI Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters Panel (Left Column) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FiFilter className="text-purple-600" /> Filters
              </h3>
              {activeFilters.length > 0 && (
                <button 
                  onClick={() => setActiveFilters([])}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map(filter => (
                  <span 
                    key={filter}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {filter}
                    <button 
                      onClick={() => toggleFilter(filter)}
                      className="hover:text-purple-600"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {Object.entries(filters).map(([category, options]) => (
              <div key={category} className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {options.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(option)}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        activeFilters.includes(option)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Before/After Gallery */}
          {selectedTreatment && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-4">{selectedTreatment.name} Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Before</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                      src={selectedTreatment.beforeImage} 
                      alt={`Before ${selectedTreatment.name}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">After</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                      src={selectedTreatment.afterImage} 
                      alt={`After ${selectedTreatment.name}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTreatment(null)}
                className="mt-4 text-purple-600 hover:underline text-sm"
              >
                Close gallery
              </button>
            </div>
          )}
        </div>

        {/* Main Content (Right Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trending Near You */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FiMapPin className="text-purple-600" /> 
                Trending Near You
              </h3>
              {!userLocation ? (
                <button 
                  onClick={getLocation}
                  className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                >
                  <FiNavigation size={14} /> Enable Location
                </button>
              ) : (
                <span className="text-sm text-gray-500">
                  {locationError || `Within ${Math.max(...trendingTreatments.map(t => t.distance || 0))}km`}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingTreatments.map(treatment => (
                <div 
                  key={treatment.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedTreatment(treatment)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    <Image 
                      src={treatment.afterImage} 
                      alt={treatment.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-sm flex items-center gap-1">
                      <FiStar className="text-yellow-500 fill-yellow-500" />
                      {treatment.rating}
                    </div>
                    {treatment.distance && (
                      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-sm">
                        {treatment.distance}km
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">{treatment.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">See before & after</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <FiStar className="text-purple-600" /> Popular Searches
            </h3>
            <div className="flex flex-wrap gap-3">
              {popularSearches.map(search => (
                <Link
                  key={search}
                  href={`/search?query=${encodeURIComponent(search)}`}
                  onClick={() => addRecentSearch(search)}
                  className="px-4 py-2 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-lg transition border border-gray-200 hover:border-purple-200"
                >
                  {search}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <FiClock className="text-purple-600" /> Recent Searches
              </h3>
              <div className="space-y-3">
                {recentSearches.map(search => (
                  <div 
                    key={search} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition group"
                  >
                    <Link
                      href={`/search?query=${encodeURIComponent(search)}`}
                      className="text-gray-700 group-hover:text-purple-700 flex-1"
                      onClick={() => addRecentSearch(search)}
                    >
                      {search}
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(search);
                      }}
                      className="text-gray-400 hover:text-purple-600 p-1"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}