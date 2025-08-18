"use client";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status, checkStatus, token, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (token && user) return;

    checkStatus();
  }, [checkStatus, token, user, hasHydrated]);

  if (!hasHydrated || status === "checking") {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
