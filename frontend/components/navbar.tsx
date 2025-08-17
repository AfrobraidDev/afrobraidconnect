// components/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Globe, Download, HelpCircle, Briefcase, ArrowRight, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-60">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/afro-connect.png"
            alt="AfroConnect Logo"
            width={180}
            height={40}
            className="object-contain"
            priority
          />
        </Link>


        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4"> {/* Reduced gap on mobile */}
          {/* Login Button (Purple Text) - Hidden on smallest screens */}
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link
              href="/login"
              className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Log in
            </Link>
          </Button>

          {/* List your business button - Hidden on smallest screens */}
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link href="/for-business">
              List your business
            </Link>
          </Button>

          {/* Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1 cursor-pointer">
                <Menu className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Menu</span> {/* Hide text on mobile */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {/* Regular menu items */}
              <DropdownMenuItem asChild>
                <Link href="/user-flow" className="flex items-center gap-3 px-2 py-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300">Log in or sign up</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/download" className="flex items-center gap-3 px-2 py-2 cursor-pointer">
                  <Download className="h-4 w-4" />
                  <span>Download App</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-3 px-2 py-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/language" className="flex items-center gap-3 px-2 py-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  <span>English (Global)</span>
                </Link>
              </DropdownMenuItem>

              {/* Separator before business section */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    Business
                  </span>
                </div>
              </div>

              {/* Business item with arrow */}
              <DropdownMenuItem asChild>
                <Link href="/for-business" className="flex items-center justify-between gap-3 px-2 py-2 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4" />
                    <span>For Business</span>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}