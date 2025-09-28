"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '@/lib/api'; // <-- 1. Your custom axios instance

// Define the shape of the user data
interface User {
  userId: string;
  organizationId: string;
  isOwner: boolean;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: string[];
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // --- 2. Replaced fetch with your api instance ---
        const response = await api.get('/auth/me'); 
        setUser(response.data); // axios puts the JSON data in `response.data`

      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};