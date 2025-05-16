"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import callAPI from "../utils/callAPI";
import { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    try {
      await callAPI(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: "POST" });
    } finally {
      setUser(null);
      router.push("/auth");
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await callAPI<{ id: string; user_name: string; email: string }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`);
        if (response) {
          setUser({ user_id: response.id, user_name: response.user_name, email: response.email });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
