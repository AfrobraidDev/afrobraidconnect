"use client";

import { useQuery } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { useSession } from "next-auth/react";

export interface Variation {
  id: string;
  name: string;
  category: string;
  price: string;
  duration_minutes: number;
}

export interface Booking {
  id: string;
  braider_id: string;
  braider_name: string;
  braider_business: string;
  service_name: string;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  total_price: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  timeline_status: string;
  is_fully_paid: boolean;
  amount_paid: number;
  balance_due: number;
  created_at: string;
  variations?: Variation[];
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

export interface BookingListAPIResponse extends Partial<PaginatedResponse> {
  status?: string;
  message?: string;
  data?:
    | PaginatedResponse
    | {
        status?: string;
        message?: string;
        data?: PaginatedResponse;
      };
}

export interface SingleBookingAPIResponse extends Partial<Booking> {
  status?: string;
  message?: string;
  data?: Booking;
}

export const useBookings = (page: number = 1, pageSize: number = 10) => {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["bookings", page, pageSize],
    queryFn: async () => {
      const token = session?.accessToken;
      if (!token) throw new Error("No access token found");

      const res = await apiController<BookingListAPIResponse>({
        method: "GET",
        url: `/bookings/?page=${page}&page_size=${pageSize}`,
        requiresAuth: true,
        token: token,
      });

      let payload: PaginatedResponse = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      if (res.data && "data" in res.data && res.data.data?.results) {
        payload = res.data.data;
      } else if (res.data && "results" in res.data) {
        payload = res.data as PaginatedResponse;
      } else if (res.results) {
        payload = res as PaginatedResponse;
      }

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

      const res = await apiController<SingleBookingAPIResponse>({
        method: "GET",
        url: `/bookings/${id}/`,
        requiresAuth: true,
        token: token,
      });

      let payload: Booking;

      if (res.id && res.service_name) {
        payload = res as Booking;
      } else if (res.data && res.data.id) {
        payload = res.data;
      } else {
        throw new Error("Invalid booking data received");
      }

      return payload;
    },
    enabled: !!id && status === "authenticated",
  });

  return {
    ...query,
    isLoading: query.isLoading || status === "loading",
  };
};
