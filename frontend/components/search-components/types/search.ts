export interface BraiderLocation {
  id: string;
  service_type:
    | "MOBILE_BASED"
    | "SHOP_BASED"
    | "HOME_BASED"
    | "INDIVIDUAL_BASED"
    | "AREA_BASED";
  address: string | null;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  radius_km: number;
}

export interface PortfolioItem {
  id: string;
  image_url: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface BraiderResult {
  id: string;
  first_name: string;
  last_name: string;
  business_name: string;
  display_name: string;
  average_rating: string;
  review_count: number;
  business_logo_url: string;
  distance_from_user_km: number;
  bio: string;
  locations: BraiderLocation[];
  portfolio: PortfolioItem[];
  skills: Skill[];
}

export interface SearchResponse {
  status: string;
  message: string;
  data: {
    count: number;
    results: BraiderResult[];
  };
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
}
