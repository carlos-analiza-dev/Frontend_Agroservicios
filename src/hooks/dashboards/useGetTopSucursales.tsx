import { useQuery } from "@tanstack/react-query";
import { ObtenerTopSucursales } from "@/apis/dashboard/accions/obtener-top-sucursales";
import { FiltrosIngresos } from "@/apis/dashboard/accions/obtener-ingresos-totales";

const useGetTopSucursales = (filtros: FiltrosIngresos = {}) => {
  return useQuery({
    queryKey: ["top-sucursales", filtros],
    queryFn: () => ObtenerTopSucursales(filtros),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export default useGetTopSucursales;
