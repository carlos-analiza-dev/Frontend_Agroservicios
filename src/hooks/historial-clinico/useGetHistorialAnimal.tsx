import { ObtenerHistorialAnimal } from "@/apis/historial-clinico/accions/obtener-historia-animal";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface UseGetHistorial {
  animalId?: string;
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

const useGetHistorialAnimal = ({
  animalId,
  limit = 10,
  offset = 0,
  fechaInicio,
  fechaFin,
}: UseGetHistorial = {}) => {
  return useQuery({
    queryKey: [
      "historial-clinico-animal",
      animalId,
      limit,
      offset,

      fechaInicio,
      fechaFin,
    ],
    queryFn: () =>
      ObtenerHistorialAnimal({
        animalId,
        limit,
        offset,

        fechaInicio,
        fechaFin,
      }),
    enabled: !!animalId,
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetHistorialAnimal;
