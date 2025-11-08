import { ObtenerTendencia } from "@/apis/dashboard/accions/obtener-tendencia";
import { useQuery } from "@tanstack/react-query";

const useGetTendencia = () => {
  return useQuery({
    queryKey: ["tendencias"],
    queryFn: ObtenerTendencia,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export default useGetTendencia;
