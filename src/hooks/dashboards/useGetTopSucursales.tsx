import { ObtenerTopSucursales } from "@/apis/dashboard/accions/obtener-top-sucursales";
import { useQuery } from "@tanstack/react-query";

const useGetTopSucursales = () => {
  return useQuery({
    queryKey: ["top-sucursales"],
    queryFn: ObtenerTopSucursales,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetTopSucursales;
