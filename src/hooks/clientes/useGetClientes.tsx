import { obtenerClientes } from "@/apis/clientes/accions/obtener-clientes";
import { useQuery } from "@tanstack/react-query";

const useGetClientesPagination = (
  debouncedSearchTerm: string,
  paisFilter: string,
  limit: number,
  page: number
) => {
  return useQuery({
    queryKey: ["clientes-admin", debouncedSearchTerm, paisFilter, page],
    queryFn: () =>
      obtenerClientes(
        limit,
        (page - 1) * limit,
        debouncedSearchTerm,
        paisFilter
      ),
    retry: 0,
  });
};

export default useGetClientesPagination;
