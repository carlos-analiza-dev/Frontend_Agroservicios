import { ObtenerRendimientoMensual } from "@/apis/dashboard/accions/obtener-rendimiento-mensual";
import { useQuery } from "@tanstack/react-query";

const useGetRendimientoMensual = () => {
  return useQuery({
    queryKey: ["rendimiento-mensual"],
    queryFn: ObtenerRendimientoMensual,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetRendimientoMensual;
