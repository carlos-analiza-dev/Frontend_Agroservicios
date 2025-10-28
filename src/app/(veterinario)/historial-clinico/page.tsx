"use client";

import React from "react";
import { HistorialClinicoList } from "./ui/HistorialClinicoList";
import { useAuthStore } from "@/providers/store/useAuthStore";

const HistorialClinicoPage = () => {
  const { user } = useAuthStore();
  const veterinarioId = user?.id || "";

  if (!veterinarioId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No autenticado</h2>
          <p className="text-muted-foreground">
            Debes iniciar sesión para ver el historial clínico.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <HistorialClinicoList veterinarioId={veterinarioId} />
    </div>
  );
};

export default HistorialClinicoPage;
