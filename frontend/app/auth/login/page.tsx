"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"
import { toast } from 'sonner'
import GoogleLoginButton from "@/components/google-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const credentials = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/login/`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { access_token, refresh_token, role } = response.data;

      if (typeof window !== 'undefined') {
        // 1. Session Storage (Client-side immediate use)
        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('user_role', role);

        // 2. Cookies (Cross-subdomain access)
        const domain = window.location.hostname.includes('localhost')
          ? 'localhost'
          : `.${window.location.hostname.split('.').slice(-2).join('.')}`;

        // Secure cookie settings
        const cookieSettings = [
          `Path=/`,
          `Domain=${domain}`,
          `SameSite=Lax`,
          `Secure`,
          `Max-Age=${60 * 60}` // 1 hour
        ].join('; ');

        document.cookie = `access_token=${access_token}; ${cookieSettings}`;
        document.cookie = `refresh_token=${refresh_token}; ${cookieSettings.replace('SameSite=Lax', 'SameSite=Strict; HttpOnly')}`;
        document.cookie = `user_role=${role}; ${cookieSettings}`;

        // 3. Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // 4. Role-based redirection
        const getRedirectUrl = () => {
          const isLocalhost = window.location.hostname.includes('localhost');
          const baseDomain = isLocalhost ? 'localhost:3000' : window.location.hostname.split('.').slice(-2).join('.');

          switch (role.toLowerCase()) {
            case 'admin':
              return isLocalhost
                ? `http://admin.localhost:3000/dashboard`
                : `https://admin.${baseDomain}/dashboard`;
            case 'braider':
              return isLocalhost
                ? `http://braider.localhost:3000/dashboard`
                : `https://braider.${baseDomain}/dashboard`;
            case 'customer':
              return isLocalhost
                ? `http://localhost:3000/dashboard/customer`
                : `https://${baseDomain}/dashboard/customer`;
            default:
              throw new Error('Invalid user role');
          }
        };

        // 5. Success flow
        toast.success(`Welcome back, ${role}! Redirecting...`);
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 1500);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message ||
          error.response?.data?.detail ||
          'An unexpected error occurred';

        switch (status) {
          case 400:
            toast.error('Invalid request format');
            break;
          case 401:
            toast.error(message.includes('password')
              ? 'Invalid password'
              : 'Account not found');
            break;
          case 403:
            toast.error('Your account is not authorized');
            break;
          case 404:
            toast.error('No account linked to this email');
            break;
          case 500:
            toast.error('Our servers are busy. Please try later');
            break;
          default:
            toast.error(message);
        }
      } else {
        toast.error('Network connection failed');
      }
    } finally {
      setIsLoading(false);
    }
  }

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

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={isLoading} />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 cursor-pointer relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <div className="dot-flashing"></div>
                  </div>
                ) : (
                  "Sign In"
                )}
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

            {/* Social Login Buttons */}
            <GoogleLoginButton />

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth"
                className="text-purple-500 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden md:block relative">
          <Image
            src="/images/login-hero.jpg"
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

      {/* Add this to your global CSS */}
      <style jsx global>{`
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: white;
          color: white;
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        .dot-flashing::before,
        .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: white;
          color: white;
        }
        .dot-flashing::before {
          left: -15px;
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dotFlashing {
          0% {
            opacity: 0.5;
            transform: scale(0.8);
          }
          50%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}