import ObtenerInsumos from "@/apis/insumos/accions/obtener-insumos";
import { useQuery } from "@tanstack/react-query";

const useGetInsumos = (limit: number, offset: number, pais?: string) => {
  return useQuery({
    queryKey: ["insumos-admin", limit, offset, pais],
    queryFn: () => ObtenerInsumos(limit, offset, pais),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetInsumos;
