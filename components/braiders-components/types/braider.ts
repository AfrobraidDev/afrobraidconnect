export interface Variation {
  id: string;
  name: string;
  category: "LENGTH" | "SIZE" | "ADDON";
  price_adjustment: string;
  duration_adjustment: number;
}

export interface Service {
  id: string;
  skill_name: string;
  base_price: string;
  base_duration_minutes: number;
  description: string;
  variations: Variation[];
}

export interface PortfolioImage {
  id: string;
  image_url: string;
  caption: string;
}

export interface Location {
  id: string;
  service_type: "MOBILE_BASED" | "SHOP_BASED" | "HOME_BASED";
  address: string | null;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  radius_km: number;
}

export interface BraiderProfileData {
  id: string;
  business_name: string;
  display_name: string;
  average_rating: string;
  review_count: number;
  first_name: string;
  last_name: string;
  bio: string;
  business_logo_url: string;
  is_phone_verified: boolean;
  document_verification_status: string;
  services: Service[];
  portfolio: PortfolioImage[];
  locations: Location[];
}
