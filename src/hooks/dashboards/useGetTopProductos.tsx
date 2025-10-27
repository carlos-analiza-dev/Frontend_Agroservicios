import { useQuery } from "@tanstack/react-query";
import { ObtenerTopProductos } from "@/apis/dashboard/accions/obtener-top-productos-vendidos";
import { FiltrosIngresos } from "@/apis/dashboard/accions/obtener-ingresos-totales";

export const useGetTopProductos = (filtros: FiltrosIngresos = {}) => {
  return useQuery({
    queryKey: ["top-productos", filtros],
    queryFn: () => ObtenerTopProductos(filtros),
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};
