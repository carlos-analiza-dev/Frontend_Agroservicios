import { ObtenerTopProductos } from "@/apis/dashboard/accions/obtener-top-productos-vendidos";
import { useQuery } from "@tanstack/react-query";

const useGetTopProductos = () => {
  return useQuery({
    queryKey: ["top-productos"],
    queryFn: ObtenerTopProductos,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetTopProductos;
