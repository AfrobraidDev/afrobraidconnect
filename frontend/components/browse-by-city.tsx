"use client"

import { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const countries = [
  'Australia', 'Bahrain', 'Barbados', 'Belgium', 'Brazil', 
  'Canada', 'France', 'Germany', 'Greece', 'Ireland', 
  'Italy', 'Mexico', 'Netherlands', 'New Zealand', 'Poland', 
  'Portugal', 'Puerto Rico', 'Qatar', 'Saudi Arabia', 'Singapore', 
  'South Africa', 'Spain', 'United Arab Emirates', 'United Kingdom', 'United States'
];

const cities = {
  Melbourne: [
    'Hair Salons', 'Nails', 'Eyebrows & Lashes', 'Beauty Salons',
    'Barbers', 'Massage Parlours', 'Spas & Saunas', 'Waxing Salons'
  ],
  Sydney: [
    'Hair Salons', 'Nails', 'Eyebrows & Lashes', 'Beauty Salons',
    'Barbers', 'Massage Parlours', 'Spas & Saunas', 'Waxing Salons'
  ],
  Perth: [
    'Hair Salons', 'Nails', 'Eyebrows & Lashes', 'Beauty Salons',
    'Barbers', 'Massage Parlours', 'Spas & Saunas', 'Waxing Salons'
  ],
  Brisbane: [
    'Hair Salons', 'Nails', 'Eyebrows & Lashes', 'Beauty Salons',
    'Barbers', 'Massage Parlours', 'Spas & Saunas', 'Waxing Salons'
  ],
  'Gold Coast': [
    'Hair Salons', 'Nails', 'Eyebrows & Lashes', 'Beauty Salons',
    'Barbers', 'Massage Parlours', 'Spas & Saunas', 'Waxing Salons'
  ]
};

export default function BrowseByCity() {
  const [selectedCountry, setSelectedCountry] = useState('Australia');
  const [selectedCity, setSelectedCity] = useState('Melbourne');
  const scrollRef = useRef(null);

  const scroll = (direction: any) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -200 : 200;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Browse by City</h2>
      
      {/* Countries Scrollable Row */}
      <div className="relative mb-10">
        <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
          <button 
            onClick={() => scroll('left')}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <FiChevronLeft className="text-purple-600 text-xl" />
          </button>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto py-4 px-10 scrollbar-hide"
        >
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition ${selectedCountry === country 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {country}
            </button>
          ))}
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 flex items-center z-10">
          <button 
            onClick={() => scroll('right')}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <FiChevronRight className="text-purple-600 text-xl" />
          </button>
        </div>
      </div>

      {/* City Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {Object.keys(cities).map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition ${selectedCity === city 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities[selectedCity]?.map((service: any) => (
          <a
            key={service}
            href="#"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 hover:border-purple-200"
          >
            <h3 className="font-medium text-gray-800">{service} in {selectedCity}</h3>
            <p className="text-sm text-gray-500 mt-1">Explore top-rated venues</p>
          </a>
        ))}
      </div>
    </div>
  );
}