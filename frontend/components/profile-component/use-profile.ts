"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { toast } from "sonner";
import { useRouter } from "@/navigation";
import { signOut, useSession } from "next-auth/react";

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  wallet_balance: string;
  role: "CUSTOMER" | "BRAIDER" | "ADMIN";
  joined_at: string;
}

interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
}

interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export const useProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = session?.accessToken;

      if (!token) throw new Error("No access token found");

      const res = await apiController<{ data: UserProfile }>({
        method: "GET",
        url: "/auth/profile/",
        requiresAuth: true,
        token: token,
      });
      return res.data;
    },
    enabled: status === "authenticated",
  });

  const updateProfile = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return apiController({
        method: "PATCH",
        url: "/auth/profile/",
        data: payload,
        requiresAuth: true,
        token: session?.accessToken,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changePassword = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return apiController({
        method: "POST",
        url: "/dashboard/settings/change-password/",
        data: payload,
        requiresAuth: true,
        token: session?.accessToken,
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deactivateAccount = useMutation({
    mutationFn: async () => {
      return apiController({
        method: "POST",
        url: "/dashboard/settings/deactivate/",
        requiresAuth: true,
        token: session?.accessToken,
      });
    },
    onSuccess: async () => {
      toast.success("Account deactivated");
      await signOut({ redirect: false });
      router.push("/auth/login");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteAccount = useMutation({
    mutationFn: async () => {
      return apiController({
        method: "DELETE",
        url: "/dashboard/settings/delete/",
        requiresAuth: true,
        token: session?.accessToken,
      });
    },
    onSuccess: async () => {
      toast.success("Account permanently deleted");
      await signOut({ redirect: false });
      router.push("/");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    profile,
    isLoading: isLoading || status === "loading",
    isError,
    error,
    refetch,
    updateProfile,
    changePassword,
    deactivateAccount,
    deleteAccount,
  };
};
