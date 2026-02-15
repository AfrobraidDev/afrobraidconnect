"use client";

import { useQuery } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { useSession } from "next-auth/react";

export interface Booking {
  id: string;
  braider_name: string;
  service_name: string;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  total_price: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  created_at: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

export const useBookings = (page: number = 1, pageSize: number = 10) => {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["bookings", page, pageSize],
    queryFn: async () => {
      const token = session?.accessToken;
      if (!token) throw new Error("No access token found");

      const res = await apiController<any>({
        method: "GET",
        url: `/bookings/?page=${page}&page_size=${pageSize}`,
        requiresAuth: true,
        token: token,
      });

      const payload: PaginatedResponse =
        res?.data?.data?.data || res?.data?.data || res?.data || res;

      return payload;
    },
    staleTime: 5 * 60 * 1000,
    enabled: status === "authenticated",
  });

  return {
    ...query,
    isLoading: query.isLoading || status === "loading",
  };
};

export const useBookingDetails = (id: string | null) => {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const token = session?.accessToken;
      if (!id || !token) throw new Error("Missing ID or token");

      const res = await apiController<any>({
        method: "GET",
        url: `/bookings/${id}/`,
        requiresAuth: true,
        token: token,
      });

      const payload: Booking = res?.data?.data || res?.data || res;
      return payload;
    },
    enabled: !!id && status === "authenticated",
  });

  return {
    ...query,
    isLoading: query.isLoading || status === "loading",
  };
};
