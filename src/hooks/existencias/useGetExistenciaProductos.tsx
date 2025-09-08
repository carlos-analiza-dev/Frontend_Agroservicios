import { obtenerExistenciaProductos } from "@/apis/existencia_productos/accions/obtener-existencia-productos";
import { useQuery } from "@tanstack/react-query";

const useGetExistenciaProductos = (producto?: string, sucursal?: string) => {
  return useQuery({
    queryKey: ["existencia-productos", producto, sucursal],
    queryFn: () => obtenerExistenciaProductos(producto, sucursal),
    retry: false,
  });
};

export default useGetExistenciaProductos;
