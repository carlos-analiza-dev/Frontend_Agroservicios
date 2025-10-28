import { ObtenerHistorialVeterinario } from "@/apis/historial-clinico/accions/obtener-historia-veterinario";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface UseGetHistorial {
  limit?: number;
  offset?: number;
  veterinario?: string;
}

const useGetHistorialVeterinario = ({
  limit = 10,
  offset = 0,
  veterinario,
}: UseGetHistorial = {}) => {
  return useQuery({
    queryKey: ["historial-clinico", limit, offset, veterinario],
    queryFn: () =>
      ObtenerHistorialVeterinario({
        limit,
        offset,
        veterinario,
      }),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetHistorialVeterinario;
