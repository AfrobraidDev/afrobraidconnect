"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Briefcase, User, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, Link } from "@/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiMenu3Fill } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LanguageSelector } from "./language-selector";
import { getSession, signOut } from "next-auth/react";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUserData({
          name: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role,
          avatar: session.user.image || undefined,
        });
        return;
      }

      const token =
        typeof window !== "undefined"
          ? sessionStorage.getItem("access_token") ||
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("access_token="))
              ?.split("=")[1]
          : null;

      if (token) {
        setIsLoggedIn(true);
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            setUserData({
              name: payload.name,
              email: payload.email,
              role: payload.role,
              avatar: payload.avatar,
            });
          }
        } catch (e) {
          console.error("Error parsing token", e);
        }
      } else {
        setIsLoggedIn(false);
        setUserData({});
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    sessionStorage.removeItem("access_token");
    document.cookie =
      "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsLoggedIn(false);
    setUserData({});
    toast.success("Logged out successfully");
    router.push("/");
    setShowLogoutConfirm(false);
  };

  const getRoleBasedLink = () => {
    if (!userData.role) return "/";
    if (userData.role === "BRAIDER") return "/dashboard";
    if (userData.role === "CUSTOMER") return "/dashboard";
    return "/dashboard";
  };

  const MobileMenu = () => (
    <div
      className="fixed inset-0 z-50 bg-[#FAF3EF] overflow-y-auto"
      style={{ height: "100dvh" }}
    >
      <div className="flex justify-between items-center p-6">
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/images/afro-logo2.png"
            alt="AfroConnect Logo"
            width={180}
            height={40}
            className="object-contain"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(false)}
          className="h-10 w-10"
        >
          <span className="text-2xl">×</span>
        </Button>
      </div>

      <div className="px-6 pb-6">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-4 my-6 p-4 bg-muted rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="bg-[#D0865A] text-white">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userData.name || "User"}</p>
                <p className="text-sm text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-14 text-base cursor-pointer"
                onClick={() => {
                  router.push(getRoleBasedLink());
                  setIsMenuOpen(false);
                }}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 text-base cursor-pointer"
                onClick={() => {
                  router.push("/settings");
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
            </nav>
          </>
        ) : (
          <div className="space-y-4 my-6">
            <Button
              className="w-full h-14 bg-[#D0865A] hover:bg-[#BF764A] text-white cursor-pointer"
              asChild
            >
              <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                Sign Up Now
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 cursor-pointer"
              asChild
            >
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                Log In
              </Link>
            </Button>
          </div>
        )}

        <div className="border-t my-6 pt-6">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-14 text-base cursor-pointer"
              asChild
            >
              <Link href="/download" onClick={() => setIsMenuOpen(false)}>
                <Download className="mr-3 h-5 w-5" />
                Download App
              </Link>
            </Button>

            <div className="w-full justify-start h-14 text-base flex items-center pl-4">
              <LanguageSelector />
            </div>
          </nav>
        </div>

        <div className="border-t my-6 pt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {isLoggedIn ? "Account" : "Business"}
          </h3>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="w-full justify-start h-14 text-base text-red-500 hover:text-red-600 cursor-pointer"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start h-14 text-base cursor-pointer"
              asChild
            >
              <Link href="/for-business" onClick={() => setIsMenuOpen(false)}>
                <Briefcase className="mr-3 h-5 w-5" />
                List Your Business
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-60 transition-all duration-300 ${
        isScrolled ? "border-b" : "border-b-0"
      } ${isScrolled ? "bg-transparent" : "bg-custom-cream"}`}
    >
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/afro-logo2.png"
            alt="AfroConnect Logo"
            width={180}
            height={40}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {!isLoggedIn && (
            <Button
              variant="outline"
              asChild
              className="hidden sm:flex cursor-pointer rounded-full text-black hover:bg-[#D0865A] hover:text-white transition-all ease-in-out"
              style={{ transitionDuration: "400ms" }}
            >
              <Link href="/auth/login">Log in</Link>
            </Button>
          )}

          {isLoggedIn && (
            <Avatar
              className="h-8 w-8 cursor-pointer hidden sm:flex"
              onClick={() => router.push(getRoleBasedLink())}
            >
              <AvatarImage src={userData.avatar} />
              <AvatarFallback className="bg-[#D0865A] text-white">
                {userData.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}

          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:flex cursor-pointer rounded-full text-black transition-all ease-in-out"
          >
            <Link href="/for-business">Join as a Braider</Link>
          </Button>

          {isMobile ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
                className="flex gap-1 cursor-pointer"
              >
                <span className="sr-only sm:not-sr-only">Navigation</span>
                <RiMenu3Fill className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <Avatar
                  className="h-8 w-8 cursor-pointer sm:hidden"
                  onClick={() => router.push(getRoleBasedLink())}
                >
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="bg-[#D0865A] text-white">
                    {userData.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-1 cursor-pointer rounded-full"
                  >
                    <span className="sr-only sm:not-sr-only">Navigation</span>
                    <RiMenu3Fill className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => router.push(getRoleBasedLink())}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/download" className="cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download App</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="relative px-2 py-1.5 text-xs text-muted-foreground">
                        Account
                      </div>
                      <DropdownMenuItem
                        onClick={() => setShowLogoutConfirm(true)}
                        className="text-red-500 focus:text-red-500 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth"
                          className="cursor-pointer text-[#D0865A] hover:text-[#BF764A]"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Sign up now</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/download" className="cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download App</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="relative px-2 py-1.5 text-xs text-muted-foreground">
                        Business
                      </div>
                      <DropdownMenuItem asChild>
                        <Link href="/for-business" className="cursor-pointer">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>For businesses</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>
        </div>
      </div>

      {isMobile && isMenuOpen && <MobileMenu />}

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
