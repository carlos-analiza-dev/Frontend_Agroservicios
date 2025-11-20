import { ObtenerPermisosActivosClientes } from "@/apis/permisos-clientes/accions/obtener-permisos-activos";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosActivos = () => {
  return useQuery({
    queryKey: ["permisos-activos-clientes"],
    queryFn: ObtenerPermisosActivosClientes,
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
};

export default useGetPermisosActivos;
