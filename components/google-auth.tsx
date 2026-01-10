'use client';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import BreathingDots from '@/components/breathing-effect';

type UserRole = 'admin' | 'braider' | 'customer';

interface AuthResponse {
  success: boolean;
  user: {
    role: UserRole;
    email: string;
    name?: string;
    id: string;
  };
  token: {
    access: string;
    refresh?: string;
    expiresIn: number;
  };
  message?: string;
}

interface GoogleAuthMessage {
  type: 'GOOGLE_AUTH_SUCCESS' | 'GOOGLE_AUTH_ERROR';
  code?: string;
  error?: string;
}

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    toast.info('Redirecting to Google...');

    try {
      const authWindow = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(
            `${window.location.origin}/api/auth/callback/google`
          )}&` +
          `response_type=code&` +
          `scope=openid%20profile%20email&` +
          `access_type=offline`,
        '_blank',
        'width=500,height=600'
      );

      if (!authWindow) {
        throw new Error('Popup window was blocked. Please allow popups for this site.');
      }

      const handleMessage = (event: MessageEvent<GoogleAuthMessage>) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.code) {
          handleGoogleCallback(event.data.code).finally(cleanup);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          toast.error(event.data.error || 'Google authentication failed');
          cleanup();
        }
      };

      const handleGoogleCallback = async (code: string) => {
        try {
          const response = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/`,
            { code },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (!response.data.success || !response.data.token?.access) {
            throw new Error(response.data.message || 'Authentication failed');
          }

          localStorage.setItem('access_token', response.data.token.access);
          const userName = response.data.user.name || response.data.user.email.split('@')[0];
          toast.success(`Welcome ${userName}!`);

          const redirectMap: Record<UserRole, string> = {
            admin: '/admin/dashboard',
            braider: '/braider/dashboard',
            customer: '/dashboard'
          };
          router.push(redirectMap[response.data.user.role] || '/');
        } catch (error) {
          handleAuthError(error);
        }
      };

      const handleAuthError = (error: unknown) => {
        const err = error as AxiosError<{ message?: string }> | Error;
        toast.error(
          err instanceof AxiosError
            ? err.response?.data?.message || 'Authentication failed'
            : err.message
        );
        console.error('Auth error:', error);
      };

      const cleanup = () => {
        setIsLoading(false);
        window.removeEventListener('message', handleMessage);
        if (timer) clearInterval(timer);
      };

      const timer = setInterval(() => {
        if (authWindow?.closed) {
          cleanup();
        }
      }, 500);

      window.addEventListener('message', handleMessage);

      return () => {
        cleanup();
      };
    } catch (error) {
      const err = error as Error;
      console.error('Google auth error:', err);
      toast.error(err.message || 'Failed to initiate Google login');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full gap-2 cursor-pointer"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        aria-label="Continue with Google"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <BreathingDots />
          </span>
        ) : (
          <>
            <FaGoogle className="h-4 w-4 text-red-500" />
            <span>Continue with Google</span>
          </>
        )}
      </Button>
    </div>
  );
}