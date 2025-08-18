"use client"

import { useState, FormEvent } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';

export default function SearchCard() {
  const [location, setLocation] = useState<string>('Current location');
  const [date, setDate] = useState<string>('Any date');
  const [time, setTime] = useState<string>('Any time');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log({ searchQuery, location, date, time });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
          Book local beauty and wellness services
        </h1>
        
        <div className="bg-white rounded-2xl shadow-md p-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Search for beauty or wellness services"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition duration-200 md:self-end"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <select
                    id="location"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="Current location">Current location</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Paris">Paris</option>
                    <option value="Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <select
                    id="date"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  >
                    <option value="Any date">Any date</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This weekend">This weekend</option>
                    <option value="Next week">Next week</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <select
                    id="time"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="Any time">Any time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}