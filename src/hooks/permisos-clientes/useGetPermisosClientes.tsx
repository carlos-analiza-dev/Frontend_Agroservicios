import { ObtenerPermisosClientes } from "@/apis/permisos-clientes/accions/obtener-permisos";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosClientes = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: ["permisos-clientes", limit, offset],
    queryFn: () => ObtenerPermisosClientes(limit, offset),
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
};

export default useGetPermisosClientes;
