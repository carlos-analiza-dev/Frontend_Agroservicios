import { ObtenerClientesActivos } from "@/apis/dashboard/accions/obtener-clientes-activos";
import { useQuery } from "@tanstack/react-query";

const useGetClienteActivos = () => {
  return useQuery({
    queryKey: ["clientes-activos"],
    queryFn: ObtenerClientesActivos,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetClienteActivos;
