"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Service = {
  image: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
};

type RecentlyViewedContextType = {
  recentlyViewed: Service[];
  addToRecentlyViewed: (service: Service) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Service[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (service: Service) => {
    setRecentlyViewed((prev) => {
      const exists = prev.find((item) => item.title === service.title);
      if (exists) return prev; // no duplicates
      return [service, ...prev].slice(0, 10); // keep last 10
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
