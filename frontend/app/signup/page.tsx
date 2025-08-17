// app/signup/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaMicrosoft, FaFacebook } from "react-icons/fa";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-white dark:bg-gray-800">
        {/* Left Column - Signup Form */}
        <div className="p-10 md:pl-20 md:pr-20 md:py-16">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Create account</h1>
              <p className="text-muted-foreground mt-2">
                Join AfroConnect to connect with African businesses
              </p>
            </div>

            {/* Email Signup Form */}
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="johnedoe@gmail.com" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required
                />
                <p className="text-xs text-muted-foreground">
                  8+ characters with numbers and symbols
                </p>
              </div>

              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Signup Buttons */}
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
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-purple-500 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Static Image */}
        <div 
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/signup-hero.jpg')",
            height: "100%",
            minHeight: "600px"
          }}
        >
          <div className="h-full flex items-center justify-center bg-black/30 p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Our Community
              </h2>
              <p className="text-gray-200 text-lg">
                Connect with businesses across Africa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}