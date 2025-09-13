import { ObtenerDescuentoProveedorAndInsumo } from "@/apis/descuentos-insumos/accions/descuentos-proveedor-insumo";
import { useQuery } from "@tanstack/react-query";

const useGetDescProveedorInsumo = (proveedorId: string, insumoId: string) => {
  return useQuery({
    queryKey: ["descuento-proveedor-insumo", proveedorId, insumoId],
    queryFn: () => ObtenerDescuentoProveedorAndInsumo(proveedorId, insumoId),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!proveedorId && !!insumoId,
  });
};

export default useGetDescProveedorInsumo;
