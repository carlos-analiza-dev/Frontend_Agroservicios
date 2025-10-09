import ObtenerLotesProducto from "@/apis/productos/accions/obtener-lotes-by-producto";
import { useQuery } from "@tanstack/react-query";

const useGetLotesByProducto = (productoId: string) => {
  return useQuery({
    queryKey: ["lotes-producto", productoId],
    queryFn: () => ObtenerLotesProducto(productoId),
    retry: 0,
  });
};

export default useGetLotesByProducto;
