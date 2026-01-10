import { useQuery } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { getSession } from "next-auth/react";

interface WalletResponse {
  status: string;
  message: string;
  data: {
    balance: number;
    currency: string;
    formatted: string;
  };
}

export const useWalletBalance = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) return null;

      const res = await apiController<WalletResponse>({
        method: "GET",
        url: "/auth/wallet/",
        requiresAuth: true,
        token: token,
      });
      return res.data;
    },
    enabled: enabled,
    staleTime: 60 * 1000,
  });
};
