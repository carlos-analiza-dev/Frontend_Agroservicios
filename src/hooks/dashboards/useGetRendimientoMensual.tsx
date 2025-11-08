import { ObtenerRendimientoMensual } from "@/apis/dashboard/accions/obtener-rendimiento-mensual";
import { useQuery } from "@tanstack/react-query";

const useGetRendimientoMensual = () => {
  return useQuery({
    queryKey: ["rendimiento-mensual"],
    queryFn: ObtenerRendimientoMensual,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export default useGetRendimientoMensual;
