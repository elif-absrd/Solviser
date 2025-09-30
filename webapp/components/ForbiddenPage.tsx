// File: apps/webapp/src/components/ForbiddenPage.tsx
"use client";

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { montserrat } from "@/lib/fonts"; // Assuming fonts are configured similarly

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-50 p-6 text-center">
      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm max-w-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h1 className={`${montserrat.className} mt-6 text-3xl font-bold tracking-tight text-gray-900`}>
          Access Denied
        </h1>
        <p className="mt-4 text-gray-600">
          You do not have the necessary permissions to view this page. Please contact your organization's administrator if you believe this is an error.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-block rounded-md bg-[#f05134] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05134]"
          >
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}