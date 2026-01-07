"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleRedirect = (path: string) => {
    const callbackUrl = encodeURIComponent(pathname);
    router.push(`${path}?callbackUrl=${callbackUrl}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center p-8 rounded-2xl bg-white">
        <DialogHeader className="mb-4">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-[#D0865A]" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            Login Required
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 mt-2">
            You need to be logged in to secure your booking. It only takes a
            moment!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            onClick={() => handleRedirect("/auth/login")}
            className="w-full h-12 bg-[#D0865A] hover:bg-[#bf764a] text-white text-lg rounded-xl font-semibold shadow-md shadow-orange-500/10"
          >
            <LogIn className="w-4 h-4 mr-2" /> Log In
          </Button>

          <Button
            variant="outline"
            onClick={() => handleRedirect("/auth/signup")}
            className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Create Account
          </Button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4"
        >
          Cancel and go back
        </button>
      </DialogContent>
    </Dialog>
  );
}
