import { ObtenerPermisosClienteId } from "@/apis/permisos-clientes/accions/obtener-permisos-cliente";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByCliente = (cliendeId: string) => {
  return useQuery({
    queryKey: ["permisos-clienteId", cliendeId],
    queryFn: () => ObtenerPermisosClienteId(cliendeId),
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
};

export default useGetPermisosByCliente;
