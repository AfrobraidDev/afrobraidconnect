'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'sonner';
import BreathingDots from '@/components/breathing-effect';

function SignupForm() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('user_type') as 'customer' | 'braider' | null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) {
      toast.error('Please select a user type first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          role: userType.toUpperCase()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Account created successfully!');
      window.location.href = userType === 'customer'
        ? '/dashboard/customer'
        : '/dashboard/braider';
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error(String(error.message));
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-white dark:bg-gray-800">
        {/* Left Column - Signup Form */}
        <div className="p-10 md:pl-20 md:pr-20 md:py-16">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Create account</h1>
              {userType && (
                <p className="text-muted-foreground mt-2">
                  Registering as a {userType}
                </p>
              )}
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johnedoe@gmail.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  8+ characters with numbers and symbols
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <BreathingDots />
                ) : (
                  'Create Account'
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
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google Signup Button */}
            <Button
              variant="outline"
              className="w-full gap-2 cursor-pointer"
              disabled={isLoading}
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/google/`}
            >
              {isLoading ? (
                <BreathingDots />
              ) : (
                <>
                  <FaGoogle className="h-4 w-4 text-red-500" />
                  Continue with Google
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-500 hover:underline cursor-pointer"
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-white dark:bg-gray-800">
          <div className="p-10 md:pl-20 md:pr-20 md:py-16">
            Loading signup form...
          </div>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}