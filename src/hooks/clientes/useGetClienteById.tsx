import { obtenerClienteById } from "@/apis/clientes/accions/get-cliente-id";
import { useQuery } from "@tanstack/react-query";

const useGetClienteById = (clienteId: string) => {
  return useQuery({
    queryKey: ["cliente", clienteId],
    queryFn: () => obtenerClienteById(clienteId),
    retry: 0,
  });
};

export default useGetClienteById;
