import { ObtenerDatosProducto } from "@/apis/datos_producto/accions/obtener-datos-producto";
import { useQuery } from "@tanstack/react-query";

const useGetDatosProducto = (
  limit: number = 10,
  offset: number,
  producto: string
) => {
  return useQuery({
    queryKey: ["datos-producto", limit, offset, producto],
    queryFn: () => ObtenerDatosProducto(limit, offset, producto),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetDatosProducto;
