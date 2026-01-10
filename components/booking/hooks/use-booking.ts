import { useMutation } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { getSession } from "next-auth/react";

interface InitiateBookingPayload {
  service_id: string;
  variation_ids: string[];
  start_time: string;
  use_wallet: boolean;
}

interface InitiateBookingResponse {
  status: string;
  message: string;
  data: {
    booking_id: string;
    client_secret?: string;
    amount_total: number;
    amount_stripe: number;
    amount_wallet: number;
    expires_in: string;
  };
}

export const useInitiateBooking = () => {
  return useMutation({
    mutationFn: async (payload: InitiateBookingPayload) => {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        throw new Error("You must be logged in to book an appointment.");
      }
      return apiController<InitiateBookingResponse>({
        method: "POST",
        url: "/bookings/initiate/",
        data: payload,
        requiresAuth: true,
        token: token,
      });
    },
  });
};
