import { useMutation } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { getSession } from "next-auth/react";

interface PayBalanceResponse {
  status: string;
  message: string;
  data: {
    booking_id: string;
    client_secret: string;
    amount_due: number;
  };
}

export const usePayBalance = () => {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        throw new Error("You must be logged in to pay the balance.");
      }

      return apiController<PayBalanceResponse>({
        method: "POST",
        url: `/bookings/${bookingId}/pay-balance/`,
        requiresAuth: true,
        token: token,
      });
    },
  });
};
