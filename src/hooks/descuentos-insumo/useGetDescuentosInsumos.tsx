import { ObtenerDescuentosInsumo } from "@/apis/descuentos-insumos/accions/obtener-descuento-insumo";
import { useQuery } from "@tanstack/react-query";

const useGetDescuentosInsumos = (insumoId: string) => {
  return useQuery({
    queryKey: ["descuento-insumo", insumoId],
    queryFn: () => ObtenerDescuentosInsumo(insumoId),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetDescuentosInsumos;
