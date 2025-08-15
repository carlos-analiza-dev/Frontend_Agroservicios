"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkStatus();
      setIsLoading(false);
    };

    initializeAuth();
  }, [checkStatus]);

  if (isLoading || status === "checking") {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
