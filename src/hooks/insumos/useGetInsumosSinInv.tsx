import ObtenerInsumosSinInventario from "@/apis/insumos/accions/obtener-insumos-sin-inventario";
import { useQuery } from "@tanstack/react-query";

const useGetInsumosSinInv = () => {
  return useQuery({
    queryKey: ["insumos-sin-inventario-admin"],
    queryFn: ObtenerInsumosSinInventario,
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetInsumosSinInv;
