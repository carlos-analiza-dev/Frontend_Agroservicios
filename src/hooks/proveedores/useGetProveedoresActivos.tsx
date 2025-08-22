import { ObtenerProveedoresActivos } from "@/apis/proveedores/accions/obtener-proveedores-activos";
import { useQuery } from "@tanstack/react-query";

const useGetProveedoresActivos = () => {
  return useQuery({
    queryKey: ["proveedores-activos"],
    queryFn: ObtenerProveedoresActivos,
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetProveedoresActivos;
