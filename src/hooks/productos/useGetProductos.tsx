import ObtenerProductos from "@/apis/productos/accions/obtener-productos";
import { useQuery } from "@tanstack/react-query";

const useGetProductos = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["productos-admin", limit, offset],
    queryFn: () => ObtenerProductos(limit, offset),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetProductos;
