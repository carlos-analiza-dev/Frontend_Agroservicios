import { ObtenerCitasCompletadas } from "@/apis/citas/accions/obtener-citas-completada";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetCitasCompletadas = (id: string) => {
  return useQuery({
    queryKey: ["all-citas-completadas", id],
    queryFn: () => ObtenerCitasCompletadas(id),
    retry: 0,
    enabled: !!id,
  });
};

export default useGetCitasCompletadas;
