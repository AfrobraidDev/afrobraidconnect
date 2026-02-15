import { apiController } from "@/lib/apiController";
import { SearchResponse, SkillsResponse } from "../types/search";

interface SearchParams {
  lat: number;
  lng: number;
  radius?: number;
  datetime?: string;
  skills?: string;
  searchTerm?: string;
  rating?: number;
  min_price?: number;
  max_price?: number;
}

export const searchBraiders = async (params: SearchParams) => {
  return apiController<SearchResponse>({
    method: "GET",
    url: "/search/",
    params: params,
  });
};

export const getBraidingSkills = async () => {
  return apiController<SkillsResponse>({
    method: "GET",
    url: "/admin/braiding-skills/?page_size=100",
  });
};
