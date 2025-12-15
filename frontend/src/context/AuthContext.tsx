import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, logout as logoutService } from "@/services/authService";

export type AuthUser = {
  id: string;
  email: string;
  role: "customer" | "designer" | "admin";
  full_name?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and user data can be recovered
    const token = getToken();
    if (token) {
      // Optionally call /api/auth/me to verify and get user details
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.user_metadata) {
            setUser({
              id: data.id,
              email: data.email,
              role: data.user_metadata?.role || "customer",
              full_name: data.user_metadata?.full_name,
            });
          }
        })
        .catch(() => {
          // Token invalid, clear it
          logoutService();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: AuthUser, token: string) => {
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}