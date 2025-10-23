import { ObtenerTopServicios } from "@/apis/dashboard/accions/obtener-top-servicios-vendidos";
import { useQuery } from "@tanstack/react-query";

const useGetTopServicios = () => {
  return useQuery({
    queryKey: ["top-servicios"],
    queryFn: ObtenerTopServicios,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetTopServicios;
