import { ObtenerTendencia } from "@/apis/dashboard/accions/obtener-tendencia";
import { useQuery } from "@tanstack/react-query";

const useGetTendencia = () => {
  return useQuery({
    queryKey: ["tendencias"],
    queryFn: ObtenerTendencia,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetTendencia;
