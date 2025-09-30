"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, LogOut, User, Settings } from "lucide-react";
import api from '@/lib/api';

// Define the structure for the user data returned from the /api/auth/me endpoint
interface UserProfile {
  name: string;
  email: string;
}

// Custom hook to fetch user data
const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // The api.ts interceptor will handle redirection on 401
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  
  return { user, loading };
};


export default function Header() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always redirect to signin page, which is on the main website
      const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
      window.location.href = `${websiteUrl}/signin`;
    }
  };
  
  // Creates a placeholder avatar with the user's initials
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-30 border-b border-gray-200">
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f05134]"
          />
        </div>
      </div>

      {/* Right Section: Profile */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-[#f05134] flex items-center justify-center text-white font-bold text-sm">
                    {user ? getInitials(user.name) : '...'}
                </div>
            )}
            <span className="hidden md:block text-sm font-medium text-gray-700">
                {loading ? 'Loading...' : (user ? user.name : 'Guest')}
            </span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-100"
                onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User size={14} /> Profile
              </a>
              {/* <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings size={14} /> Settings
              </a> */}
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
