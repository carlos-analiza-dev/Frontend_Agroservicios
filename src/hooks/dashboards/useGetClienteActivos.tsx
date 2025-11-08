import { ObtenerClientesActivos } from "@/apis/dashboard/accions/obtener-clientes-activos";
import { useQuery } from "@tanstack/react-query";

const useGetClienteActivos = () => {
  return useQuery({
    queryKey: ["clientes-activos"],
    queryFn: ObtenerClientesActivos,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export default useGetClienteActivos;
