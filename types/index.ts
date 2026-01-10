// types/index.ts
export type Business = {
  id: number | string; // Changed to support both number and string
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  rating?: number;
  hours?: string;
  phone?: string;
  website?: string;
  image: string; // Made non-optional to match your usage
  gallery?: string[];
  group?: string; // Added to match your component usage
  socials?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
};

// Keep your existing User and ApiResponse types
export type User = {
  id: string;
  name: string;
  email: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};
