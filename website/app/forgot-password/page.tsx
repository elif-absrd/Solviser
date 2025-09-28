// File: app/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { montserrat } from "@/app/fonts";
import { Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    // Handle password reset logic here (e.g., call an API to send the email)
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/blacklogo.png" alt="Solviser Logo" width={150} height={35} />
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {!submitted ? (
            <>
              <h2 className={`${montserrat.className} text-3xl font-bold text-gray-900 mb-2 text-center`}>
                Forgot Password?
              </h2>
              <p className="text-center text-gray-600 mb-8">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#FF4D00] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02]">
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
                <h2 className={`${montserrat.className} text-3xl font-bold text-gray-900 mb-2`}>
                    Check Your Email
                </h2>
                <p className="text-gray-600">
                    We've sent a password reset link to <span className="font-semibold text-gray-800">{email}</span>. Please check your inbox and spam folder.
                </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          <Link href="/signin" className="font-semibold text-[#FF4D00] hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}