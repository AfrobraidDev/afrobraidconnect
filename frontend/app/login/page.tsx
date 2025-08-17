// app/login/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle, FaMicrosoft, FaFacebook } from "react-icons/fa";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-white dark:bg-gray-800">
        {/* Left Column - Login Form */}
        <div className="p-10 md:pl-20 md:pr-20 md:py-16">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to access your AfroConnect account
              </p>
            </div>

            {/* Email/Password Form */}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@afroconnect.com" 
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-purple-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                  Or sign in with
                </span>
              </div>
            </div>

            {/* Social Login Buttons - Moved Below */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <FaGoogle className="h-4 w-4 text-red-500" />
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <FaMicrosoft className="h-4 w-4 text-blue-500" />
                Continue with Microsoft
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <FaFacebook className="h-4 w-4 text-blue-600" />
                Continue with Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-purple-500 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Simplified Image */}
        <div className="hidden md:block relative">
          <Image
            src="/images/login-hero.jpg" // Replace with your image path
            alt="African business professionals networking"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                AfroConnect Network
              </h2>
              <p className="text-gray-200 text-lg">
                Connecting businesses across Africa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}