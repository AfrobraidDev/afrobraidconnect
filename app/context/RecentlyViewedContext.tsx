"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Service = {
  id: string;
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

const RecentlyViewedContext = createContext<
  RecentlyViewedContextType | undefined
>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Service[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Service>[];

        const validItems = parsed.filter(
          (item): item is Service => typeof item.id === "string",
        );

        setRecentlyViewed(validItems);
      } catch (e) {
        console.error("Failed to parse recently viewed items", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (service: Service) => {
    setRecentlyViewed((prev) => {
      const exists = prev.find((item) => item.id === service.id);
      if (exists) return prev;
      return [service, ...prev].slice(0, 10);
    });
  };

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addToRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error(
      "useRecentlyViewed must be used within a RecentlyViewedProvider",
    );
  }
  return context;
}
