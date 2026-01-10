// lib/api/search.ts
import { apiController } from "@/lib/apiController";
import { SearchResponse, ServiceType } from "../types/search";

interface SearchParams {
  lat: number;
  lng: number;
  radius?: number;
  datetime?: string;
  service_type_id?: string;
  searchTerm?: string;
}

export const searchBraiders = async (params: SearchParams) => {
  return apiController<SearchResponse>({
    method: "GET",
    url: "/search/",
    params: params,
  });
};

export const getServiceTypes = async () => {
  return apiController<{ data: ServiceType[] }>({
    method: "GET",
    url: "/braiders/public/service-types/",
  });
};
