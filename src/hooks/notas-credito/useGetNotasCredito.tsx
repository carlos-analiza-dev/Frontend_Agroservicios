import { ObtenerNotasCredito } from "@/apis/nota-credito/accions/obtener-nota-credito";
import { useQuery } from "@tanstack/react-query";

interface UseGetNotas {
  limit?: number;
  offset?: number;
}

const useGetNotasCredito = ({ limit = 10, offset = 0 }: UseGetNotas = {}) => {
  return useQuery({
    queryKey: ["notas-credito", limit, offset],
    queryFn: () =>
      ObtenerNotasCredito({
        limit,
        offset,
      }),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetNotasCredito;
