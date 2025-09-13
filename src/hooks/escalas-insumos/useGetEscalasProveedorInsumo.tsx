import { ObtenerEscalasProveedorAndProducto } from "@/apis/escala-producto/accions/escalas-proveedor-producto";
import { ObtenerEscalasProveedorAndInsumo } from "@/apis/escalas-insumos/accions/escalas-proveedor-insumo";
import { useQuery } from "@tanstack/react-query";

const useGetEscalasProveedorAndInsumo = (
  proveedorId: string,
  insumoId: string
) => {
  return useQuery({
    queryKey: ["escalas-proveedor-insumo", proveedorId, insumoId],
    queryFn: () => ObtenerEscalasProveedorAndInsumo(proveedorId, insumoId),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!proveedorId && !!insumoId,
  });
};

export default useGetEscalasProveedorAndInsumo;
