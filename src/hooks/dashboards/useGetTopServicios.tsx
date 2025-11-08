import { FiltrosIngresos } from "@/apis/dashboard/accions/obtener-ingresos-totales";
import { ObtenerTopServicios } from "@/apis/dashboard/accions/obtener-top-servicios-vendidos";
import { useQuery } from "@tanstack/react-query";

const useGetTopServicios = (filtros: FiltrosIngresos = {}) => {
  return useQuery({
    queryKey: ["top-servicios", filtros],
    queryFn: () => ObtenerTopServicios(filtros),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export default useGetTopServicios;
