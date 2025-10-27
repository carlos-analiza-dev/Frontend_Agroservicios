import {
  FiltrosIngresos,
  ObtenerIngresosTotales,
} from "@/apis/dashboard/accions/obtener-ingresos-totales";
import { useQuery } from "@tanstack/react-query";

export const useIngresosTotales = (filtros: FiltrosIngresos = {}) => {
  return useQuery({
    queryKey: ["ingresos-totales", filtros],
    queryFn: () => ObtenerIngresosTotales(filtros),
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};
