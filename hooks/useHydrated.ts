"use client";
import { useEffect, useState } from "react";

/**
 * Returns `true` once the client has mounted and Zustand's persist
 * middleware has rehydrated from localStorage.
 * Without this guard, `isAuthenticated` is always `false` on the
 * first render (SSR/hydration), causing a spurious redirect to login.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // One tick after mount = after Zustand rehydrates from localStorage
    setHydrated(true);
  }, []);
  return hydrated;
}
