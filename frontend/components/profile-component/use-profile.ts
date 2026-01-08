"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";
import { toast } from "sonner";
import { useRouter } from "@/navigation";
import { signOut, useSession } from "next-auth/react"; // 1. Import useSession

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
  const { data: session, status } = useSession(); // 2. Get Session

  // 3. GET PROFILE (Only run when we have a token)
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

      // Safety check, though 'enabled' handles this mostly
      if (!token) throw new Error("No access token found");

      const res = await apiController<{ data: UserProfile }>({
        method: "GET",
        url: "/auth/profile/",
        requiresAuth: true,
        token: token, // 4. Pass token explicitly
      });
      return res.data;
    },
    // 5. Only run query if session is authenticated
    enabled: status === "authenticated",
  });

  // 6. UPDATE PROFILE
  const updateProfile = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return apiController({
        method: "PATCH",
        url: "/auth/profile/",
        data: payload,
        requiresAuth: true,
        token: session?.accessToken, // Pass token
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // 7. CHANGE PASSWORD
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

  // 8. DEACTIVATE ACCOUNT
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

  // 9. DELETE ACCOUNT
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
    // Loading is true if query is loading OR session is still loading
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
