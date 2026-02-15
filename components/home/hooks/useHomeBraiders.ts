import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/lib/apiController";

const LOCATION_STORAGE_KEY = "afrobraids_saved_location";

export interface FormattedBraider {
  id: string;
  image: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
}

interface APIBraider {
  id: string;
  business_name: string;
  average_rating: string;
  review_count: number;
  business_logo_url: string;
  locations: { city: string; country: string; address: string | null }[];
  portfolio: { image_url: string }[];
  skills: { name: string }[];
}

interface APIResponse {
  data: {
    results: APIBraider[];
  };
}

const formatBraiderData = (braider: APIBraider): FormattedBraider => {
  const primaryLocation = braider.locations?.[0];
  const locationString = primaryLocation
    ? primaryLocation.address ||
      `${primaryLocation.city}, ${primaryLocation.country}`
    : "Location varies";

  const image =
    braider.portfolio?.[0]?.image_url ||
    braider.business_logo_url ||
    "/images/placeholder-hair.jpg";

  return {
    id: braider.id,
    image,
    title: braider.business_name || "Braider",
    rating: parseFloat(braider.average_rating || "0"),
    reviews: braider.review_count || 0,
    location: locationString,
    services: braider.skills?.map((s) => s.name) || [],
  };
};

export const useHomeBraiders = () => {
  const { data: session } = useSession();

  const [coords, setCoords] = useState<{ lat?: number; lng?: number } | null>(
    null,
  );

  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng) {
          setCoords({ lat: parsed.lat, lng: parsed.lng });
          return;
        }
      } catch (e) {
        console.error("Failed to parse cached location", e);
      }
    }
    setCoords({});
  }, []);

  const queryParams: Record<string, string | number> = {};
  if (coords?.lat && coords?.lng) {
    queryParams.lat = coords.lat;
    queryParams.lng = coords.lng;
    queryParams.radius = 100000;
  }

  const newToQuery = useQuery({
    queryKey: ["home", "new", coords],
    queryFn: async () => {
      const res = await apiController<APIResponse>({
        method: "GET",
        url: "/search/new-to-afrobraider/",
        params: queryParams,
      });
      return res.data?.results?.map(formatBraiderData) || [];
    },
    enabled: coords !== null,
    staleTime: 5 * 60 * 1000,
  });

  const trendingQuery = useQuery({
    queryKey: ["home", "trending", coords],
    queryFn: async () => {
      const res = await apiController<APIResponse>({
        method: "GET",
        url: "/search/trending/",
        params: queryParams,
      });
      return res.data?.results?.map(formatBraiderData) || [];
    },
    enabled: coords !== null,
    staleTime: 5 * 60 * 1000,
  });

  const recommendedQuery = useQuery({
    queryKey: ["home", "recommended", coords, session?.accessToken],
    queryFn: async () => {
      const res = await apiController<APIResponse>({
        method: "GET",
        url: "/search/recommended/",
        params: queryParams,
        requiresAuth: !!session?.accessToken,
        token: session?.accessToken,
      });
      return res.data?.results?.map(formatBraiderData) || [];
    },
    enabled: coords !== null,
    staleTime: 5 * 60 * 1000,
  });

  return {
    newToAfroBraid: newToQuery.data || [],
    trending: trendingQuery.data || [],
    recommended: recommendedQuery.data || [],
    isLoading:
      coords === null ||
      newToQuery.isLoading ||
      trendingQuery.isLoading ||
      recommendedQuery.isLoading,
  };
};
