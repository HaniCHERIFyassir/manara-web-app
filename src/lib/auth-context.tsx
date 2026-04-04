"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, PartnerCompany } from "@/types/partner";
import * as authApi from "./api/auth";
import * as partnersApi from "./api/partners";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: UserProfile | null;
  tenant: PartnerCompany | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateOnboarding: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<PartnerCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Handle persistence via localStorage for the pitch demo
  useEffect(() => {
    const savedUser = localStorage.getItem("manara_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as UserProfile;
      setUser(parsedUser);
      partnersApi.fetchPartnerById(parsedUser.tenantId).then(setTenant);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    const { user: newUser, error } = await authApi.login(email);
    
    if (newUser) {
      setUser(newUser);
      const partner = await partnersApi.fetchPartnerById(newUser.tenantId);
      setTenant(partner);
      localStorage.setItem("manara_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setTenant(null);
    localStorage.removeItem("manara_user");
    router.push("/");
  };

  const updateOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = await authApi.completeOnboarding(data);
    setUser(updatedUser);
    localStorage.setItem("manara_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, tenant, isLoading, login, logout, updateOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
