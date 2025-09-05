import { ObtenerComprasInsumos } from "@/apis/compras_insumos/accions/obtener-compras-insumos";
import { useQuery } from "@tanstack/react-query";

const useGetComprasInsumos = (
  limit: number = 10,
  offset: number,
  proveedor: string,
  sucursal: string,
  tipoPago: string
) => {
  return useQuery({
    queryKey: [
      "compras-insumos-admin",
      limit,
      offset,
      proveedor,
      sucursal,
      tipoPago,
    ],
    queryFn: () =>
      ObtenerComprasInsumos(limit, offset, proveedor, sucursal, tipoPago),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetComprasInsumos;
