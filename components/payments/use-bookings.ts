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

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

interface BookingListAPIResponse {
  status?: string;
  message?: string;
  data?:
    | {
        status?: string;
        message?: string;
        data?: PaginatedResponse;
      }
    | PaginatedResponse;
}

interface SingleBookingAPIResponse {
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

      const res = await apiController<
        BookingListAPIResponse | PaginatedResponse
      >({
        method: "GET",
        url: `/bookings/?page=${page}&page_size=${pageSize}`,
        requiresAuth: true,
        token: token,
      });

      let payload: PaginatedResponse;

      if ("results" in res && "count" in res) {
        payload = res as PaginatedResponse;
      } else if (res.data && "results" in res.data && "count" in res.data) {
        payload = res.data as PaginatedResponse;
      } else if (res.data && "data" in res.data && res.data.data) {
        payload = res.data.data;
      } else {
        payload = { count: 0, next: null, previous: null, results: [] };
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

      const res = await apiController<SingleBookingAPIResponse | Booking>({
        method: "GET",
        url: `/bookings/${id}/`,
        requiresAuth: true,
        token: token,
      });

      let payload: Booking;

      if ("id" in res && "service_name" in res) {
        payload = res as Booking;
      } else if (res.data && "id" in res.data) {
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
