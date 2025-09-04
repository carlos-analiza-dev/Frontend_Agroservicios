import { ObtenerCompras } from "@/apis/compras_productos/accions/obtener-compras-productos";
import { useQuery } from "@tanstack/react-query";

const useGetCompras = (
  limit: number = 10,
  offset: number,
  proveedor: string,
  sucursal: string,
  tipoPago: string
) => {
  return useQuery({
    queryKey: ["compras-admin", limit, offset, proveedor, sucursal, tipoPago],
    queryFn: () => ObtenerCompras(limit, offset, proveedor, sucursal, tipoPago),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetCompras;
