import ObtenerProductosNoVendidos from "@/apis/productos-no-vendidos/accions/obtener-productos-no-vendidos";
import { useQuery } from "@tanstack/react-query";
interface UseGetProductosParams {
  limit: number;
  offset: number;
}

const useGetProductosNoVendidos = ({
  limit,
  offset,
}: UseGetProductosParams) => {
  return useQuery({
    queryKey: ["productos-no-vendidos", limit, offset],
    queryFn: () => ObtenerProductosNoVendidos(limit, offset),
    retry: false,
  });
};

export default useGetProductosNoVendidos;
