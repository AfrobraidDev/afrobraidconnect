'use client';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import BreathingDots from '@/components/breathing-effect'

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

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    toast.info('Redirecting to Google...');

    try {
      // 1. Open Google OAuth popup
      const authWindow = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/callback/google')}&` +
        `response_type=code&` +
        `scope=openid%20profile%20email&` +
        `access_type=offline`,
        '_blank',
        'width=500,height=600'
      );

      // 2. Listen for callback message
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          try {
            const { code } = event.data;
            
            // 3. Send authorization code to backend
            const response = await axios.post<AuthResponse>(
              `${process.env.NEXT_PUBLIC_AUTH_URL}/google/`,
              { code },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );

            if (!response.data.success || !response.data.token) {
              throw new Error(response.data.message || 'Authentication failed');
            }

            // 4. Store token and user data
            localStorage.setItem('access_token', response.data.token.access);
            const userName = response.data.user.name || response.data.user.email.split('@')[0];
            toast.success(`Welcome ${userName}!`);

            // 5. Redirect based on role
            const redirectMap = {
              admin: '/admin/dashboard',
              braider: '/braider/dashboard',
              customer: '/dashboard'
            };
            
            router.push(redirectMap[response.data.user.role] || '/');

          } catch (error: any) {
            toast.error(error.message || 'Authentication failed');
            console.error('Auth error:', error);
          } finally {
            setIsLoading(false);
            window.removeEventListener('message', handleMessage);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // Fallback if window closes
      const timer = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(timer);
          setIsLoading(false);
          window.removeEventListener('message', handleMessage);
        }
      }, 500);

    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error.message || 'Failed to initiate Google login');
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