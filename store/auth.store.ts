"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("ct_token", token);
          localStorage.setItem("ct_user", JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ct_token");
          localStorage.removeItem("ct_user");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
    }),
    { name: "ct-auth" }
  )
);
