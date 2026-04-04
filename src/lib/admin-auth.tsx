"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type AdminAuthContextType = {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("manara_admin_session");
    if (saved === "true") {
      setIsAdmin(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAdmin, isLoading, pathname, router]);

  const login = (password: string) => {
    if (password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem("manara_admin_session", "true");
      router.push("/admin");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("manara_admin_session");
    router.push("/admin/login");
  };

  if (isLoading) return null; // Or a loading spinner

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
