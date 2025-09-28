// File: apps/webapp/src/app/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { RotateCcw, AlertCircle, Save, User, Mail, Lock } from 'lucide-react';
import ForbiddenPage from '@/components/ForbiddenPage';

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        setName(response.data.name);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setIsForbidden(true);
        } else {
          setError("Failed to load your profile data.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSavingProfile(true);
      setError(null);
      setSuccessMessage(null);
      try {
          const response = await api.patch('/user/profile', { name });
          setUser(response.data.user);
          setSuccessMessage('Profile updated successfully!');
      } catch (err: any) {
          setError(err.response?.data?.error || 'Failed to update profile.');
      } finally {
          setIsSavingProfile(false);
      }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
          setPasswordError("New passwords do not match.");
          return;
      }
      setIsSavingPassword(true);
      setPasswordError(null);
      setSuccessMessage(null);
      try {
          await api.patch('/user/password', { currentPassword, newPassword });
          setSuccessMessage('Password changed successfully!');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
      } catch (err: any) {
          setPasswordError(err.response?.data?.error || 'Failed to change password.');
      } finally {
          setIsSavingPassword(false);
      }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><RotateCcw className="w-8 h-8 animate-spin text-[#f05134]" /></div>;
  }

  if (isForbidden) {
    return <ForbiddenPage />;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
      <p className="text-gray-600 mb-8">Manage your personal information and password.</p>

      {successMessage && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">{successMessage}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" id="fullName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="email" id="email" value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                    </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end">
                    <button type="submit" disabled={isSavingProfile} className="flex items-center gap-2 text-sm bg-[#f05134] text-white py-2 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">
                        <Save size={16} /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
        
        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
             <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                    <label htmlFor="currentPassword"
                     className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="newPassword"
                     className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="confirmPassword"
                     className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                    </div>
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                 <div className="flex justify-end">
                    <button type="submit" disabled={isSavingPassword} className="flex items-center gap-2 text-sm bg-[#f05134] text-white py-2 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">
                        <Save size={16} /> {isSavingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
             </form>
        </div>
      </div>
    </div>
  );
}