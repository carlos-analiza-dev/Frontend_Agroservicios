import ObtenerLotesInsumo from "@/apis/insumos/accions/obtener-lotes-by-insumo";
import { useQuery } from "@tanstack/react-query";

const useGetLotesByInsumo = (insumoId: string) => {
  return useQuery({
    queryKey: ["lotes-insumo", insumoId],
    queryFn: () => ObtenerLotesInsumo(insumoId),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetLotesByInsumo;
