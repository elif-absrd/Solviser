// File: app/signin/page.tsx
"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { montserrat } from "@/app/fonts";
import { Lock, Mail, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleIcon = () => ( <svg className="w-5 h-5" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.5C34.553 4.846 29.624 2.5 24 2.5C11.696 2.5 2.5 11.696 2.5 24s9.196 21.5 21.5 21.5c11.973 0 21.129-9.281 21.5-21.057V20.083z"></path> <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039L38.802 8.5C34.553 4.846 29.624 2.5 24 2.5C16.318 2.5 9.656 6.337 6.306 14.691z"></path> <path fill="#4CAF50" d="M24 45.5c5.624 0 10.553-2.346 14.802-6.098l-6.571-4.819c-2.119 1.885-4.902 3.039-7.961 3.039c-5.039 0-9.345-2.608-11.429-6.571l-6.571 4.819C9.656 41.663 16.318 45.5 24 45.5z"></path> <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.571 4.819c3.93-3.617 6.216-8.724 6.216-14.39z"></path> </svg> );

// Security helper to validate the redirect URL
const isValidRedirectUrl = (url: string | null): url is string => {
  return url ? url.startsWith('/') && !url.startsWith('//') : false;
};

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get('redirect') : null; // <-- Read the redirect param safely

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSuccess = (token: string) => {
    try {
      const decodedToken: { isNewUser?: boolean } = jwtDecode(token);
      const appUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || '';
      
      if (isValidRedirectUrl(redirectUrl)) {
          router.push(redirectUrl);
      } else if (decodedToken.isNewUser) {
          router.push('/welcome');
      } else {
          router.push(`${appUrl}/dashboard`);
      }
    } catch (e) {
        setError("An authentication error occurred.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            handleAuthSuccess(response.data.token);
        }
    } catch (err: any) {
        setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post('/auth/google-callback', { code: codeResponse.code });
        if (response.data.token) {
          handleAuthSuccess(response.data.token);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Google Sign-In failed.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Google Sign-In failed. Please try again.'),
  });

  const safeSignUpUrl = isValidRedirectUrl(redirectUrl) ? `/signup?redirect=${redirectUrl}` : "/signup";

  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden text-center mb-8">
        <Link href="/"><Image src="/blacklogo.png" alt="Solviser Logo" width={150} height={35} /></Link>
      </div>
      <h2 className={`${montserrat.className} text-3xl font-bold text-gray-900 mb-2 text-center`}>Sign In</h2>
      <p className="text-center text-gray-600 mb-8">Enter your credentials to access your account.</p>
      <button onClick={() => handleGoogleLogin()} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
        <GoogleIcon />
        <span className="font-semibold text-gray-700">Sign in with Google</span>
      </button>
      <div className="flex items-center my-8">
        <hr className="flex-grow border-gray-200" /><span className="mx-4 text-sm font-medium text-gray-500">OR</span><hr className="flex-grow border-gray-200" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Link href="/forgot-password" className="text-sm text-[#FF4D00] hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00]" />
          </div>
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button type="submit" className="w-full bg-[#FF4D00] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02]" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-8">
        Don't have an account?{' '}
        <Link href={safeSignUpUrl} className="font-semibold text-[#FF4D00] hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

const SignInPageContent = () => (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#262626] text-white p-12 text-center">
        <Link href="/" className="mb-8"><Image src="/whitelogo.png" alt="Solviser Logo" width={180} height={40} /></Link>
        <h1 className={`${montserrat.className} text-3xl font-bold mb-4`}>Welcome Back to Solviser</h1>
        <p className="text-slate-300 max-w-sm">Secure your deals, manage risks, and grow your business with confidence.</p>
        <div className="mt-8 w-full max-w-sm h-1 bg-white/10 rounded-full" />
      </div>
      <div className="flex items-center justify-center p-8 bg-white">
        <Suspense fallback={<RotateCcw className="w-8 h-8 animate-spin text-[#FF4D00]" />}>
            <SignInForm />
        </Suspense>
      </div>
    </div>
);

export default function SignInPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <div>Authentication is currently unavailable.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
        <SignInPageContent />
    </GoogleOAuthProvider>
  );
}