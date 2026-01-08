"use client";

import { useEffect, useState } from "react";
import { useProfile } from "./use-profile";
import { format } from "date-fns";
import {
  User,
  Wallet,
  Lock,
  ShieldAlert,
  Loader2,
  Save,
  LogOut,
  Trash2,
  CalendarDays,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/navigation";

const formatEuro = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(num || 0);
};

export default function ProfilePage() {
  const router = useRouter();
  const {
    profile,
    isLoading,
    isError,
    refetch,
    updateProfile,
    changePassword,
    deactivateAccount,
    deleteAccount,
  } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
    }
  }, [profile]);

  const handleUpdateProfile = () => {
    updateProfile.mutate({ first_name: firstName, last_name: lastName });
  };

  const handleChangePassword = () => {
    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setOldPassword("");
          setNewPassword("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#D0865A]" />
        <p className="text-gray-500 text-sm">Loading your profile...</p>
      </div>
    );
  }

  // ERROR STATE UI
  if (isError || !profile) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4 px-4 text-center">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Unable to load profile
        </h2>
        <p className="text-gray-500 max-w-md">
          We couldn't fetch your profile data. You might need to sign in again.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
          <Button
            className="bg-[#D0865A] hover:bg-[#bf764a] text-white"
            onClick={() => router.push("/auth/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 pb-20">
      {/* 1. HEADER & WALLET */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-md bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border-2 border-white/20 uppercase">
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </div>
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-[#D0865A] text-white border-none hover:bg-[#D0865A]"
                >
                  {profile.role}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                  <CalendarDays className="w-3 h-3" />
                  Joined{" "}
                  {profile.joined_at
                    ? format(new Date(profile.joined_at), "MMMM d, yyyy")
                    : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#D0865A]">
              {formatEuro(profile.wallet_balance)}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Available for bookings and services.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EDIT PROFILE */}
        <Card className="shadow-sm border-gray-200 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#D0865A]" /> Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400">
                Email cannot be changed.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 px-6 py-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfile.isPending}
              className="bg-black hover:bg-gray-800 text-white ml-auto"
            >
              {updateProfile.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* CHANGE PASSWORD */}
        <Card className="shadow-sm border-gray-200 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#D0865A]" /> Security
            </CardTitle>
            <CardDescription>
              Ensure your account is using a strong password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPass">Current Password</Label>
              <Input
                id="oldPass"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPass">New Password</Label>
              <Input
                id="newPass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 px-6 py-4">
            <Button
              onClick={handleChangePassword}
              disabled={
                changePassword.isPending || !oldPassword || !newPassword
              }
              className="bg-black hover:bg-gray-800 text-white ml-auto"
            >
              {changePassword.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Update Password
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 3. DANGER ZONE */}
      <div className="pt-8">
        <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Danger Zone
        </h3>
        <Card className="border-red-100 shadow-sm bg-red-50/30">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Deactivate Account
                </h4>
                <p className="text-sm text-gray-500">
                  Temporarily hide your profile. You can reactivate it anytime
                  by logging in.
                </p>
              </div>
              <Dialog
                open={isDeactivateDialogOpen}
                onOpenChange={setIsDeactivateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Deactivate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deactivate Account?</DialogTitle>
                    <DialogDescription>
                      Your profile will be hidden from search results. You can
                      reactivate it simply by logging in again.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeactivateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deactivateAccount.mutate()}
                      disabled={deactivateAccount.isPending}
                    >
                      {deactivateAccount.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      Confirm Deactivation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Separator className="bg-red-100" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Delete Account</h4>
                <p className="text-sm text-gray-500">
                  Permanently remove your account and data. This action cannot
                  be undone.
                </p>
              </div>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600">
                      Permanently Delete Account?
                    </DialogTitle>
                    <DialogDescription>
                      This action is <strong>irreversible</strong>. All your
                      bookings, wallet balance, and data will be permanently
                      removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteAccount.mutate()}
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      Yes, Delete Everything
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
