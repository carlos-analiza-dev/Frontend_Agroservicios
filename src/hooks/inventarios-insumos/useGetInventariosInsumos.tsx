import ObtenerInventarios from "@/apis/inventario-insumos/accions/obtener-inventario-insumos";
import { useQuery } from "@tanstack/react-query";

const useGetInventariosInsumos = (
  limit: number,
  offset: number,
  pais?: string
) => {
  return useQuery({
    queryKey: ["inventarios-admin", limit, offset, pais],
    queryFn: () => ObtenerInventarios(limit, offset, pais),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetInventariosInsumos;
