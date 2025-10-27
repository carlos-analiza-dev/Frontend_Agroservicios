import { useQuery } from "@tanstack/react-query";
import { ObtenerTopSucursales } from "@/apis/dashboard/accions/obtener-top-sucursales";
import { FiltrosIngresos } from "@/apis/dashboard/accions/obtener-ingresos-totales";

const useGetTopSucursales = (filtros: FiltrosIngresos = {}) => {
  return useQuery({
    queryKey: ["top-sucursales", filtros],
    queryFn: () => ObtenerTopSucursales(filtros),
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetTopSucursales;
