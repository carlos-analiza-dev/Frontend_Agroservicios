import ObtenerProductos from "@/apis/productos/accions/obtener-productos";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductosParams {
  limit: number;
  offset: number;
  pais?: string;
  categoria?: string;
  marca?: string;
  proveedor?: string;
}

const useGetProductos = ({
  limit,
  offset,
  pais,
  categoria,
  marca,
  proveedor,
}: UseGetProductosParams) => {
  return useQuery({
    queryKey: [
      "productos-admin",
      limit,
      offset,
      pais,
      categoria,
      marca,
      proveedor,
    ],
    queryFn: () =>
      ObtenerProductos(limit, offset, pais, categoria, marca, proveedor),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetProductos;
