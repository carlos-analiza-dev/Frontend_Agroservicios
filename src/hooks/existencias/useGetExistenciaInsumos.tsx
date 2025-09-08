import { obtenerExistenciaInsumos } from "@/apis/existencia_insumos/accions/obtener-existencia-insumos";
import { useQuery } from "@tanstack/react-query";

const useGetExistenciaInsumos = (insumo?: string, sucursal?: string) => {
  return useQuery({
    queryKey: ["existencia-insumos", insumo, sucursal],
    queryFn: () => obtenerExistenciaInsumos(insumo, sucursal),
    retry: false,
  });
};

export default useGetExistenciaInsumos;
