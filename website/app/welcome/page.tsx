// File: app/welcome/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { montserrat } from "@/app/fonts";
import { Building, ArrowRight, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

// This interface defines the user data returned from our secure /api/auth/me endpoint
interface UserProfile {
  name: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // This effect now fetches the user's profile from the secure endpoint
    // to verify their session and get their name.
    const verifyUserSession = async () => {
      try {
        const response = await api.get<UserProfile>('/auth/me');
        if (response.data.name) {
          setUserName(response.data.name.split(' ')[0]); // Get first name
        }
      } catch (e) {
        // The Axios interceptor will automatically handle 401 redirects to /signin.
        // This catch block is for other potential errors.
        console.error("Failed to verify user session", e);
        // You might want to redirect here as well just in case
        router.push('/signin');
      } finally {
        setIsLoading(false); // Stop loading once user is verified or redirect has happened
      }
    };

    verifyUserSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // The API endpoint is plural: /organization/setup
      const response = await api.patch('/organization/setup', {
        organizationName,
      });

      if (response.status === 200) {
        // On success, redirect to the main webapp dashboard
        const appUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || '';
        router.push(`${appUrl}/dashboard`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !userName) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <RotateCcw className="w-8 h-8 text-[#f05134] animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md text-center">
            <Image src="/blacklogo.png" alt="Solviser Logo" width={150} height={35} className="mx-auto mb-8" />
            
            <h1 className={`${montserrat.className} text-3xl font-bold text-gray-900`}>
                Welcome, {userName || 'there'}!
            </h1>
            <p className="text-gray-600 mt-2 mb-8">
                Just one more step. Let's set up your organization.
            </p>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1 text-left">Organization Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                id="organizationName"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                placeholder="Your Company Inc."
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button 
                      type="submit" 
                      className="group w-full bg-[#FF4D00] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-opacity-50"
                      disabled={isLoading}
                    >
                      <span>{isLoading ? 'Saving...' : 'Continue to Dashboard'}</span>
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}