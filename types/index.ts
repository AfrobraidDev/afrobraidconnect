// types/index.ts
export type Business = {
  id: number;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  rating?: number;
  hours?: string;
  phone: string;
  website?: string;
  image?: string;
  gallery?: string[];
};

// Add other shared types as needed
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