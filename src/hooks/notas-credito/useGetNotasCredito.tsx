import { ObtenerNotasCredito } from "@/apis/nota-credito/accions/obtener-nota-credito";
import { useQuery } from "@tanstack/react-query";

interface UseGetNotas {
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

const useGetNotasCredito = ({
  limit = 10,
  offset = 0,
  fechaInicio,
  fechaFin,
}: UseGetNotas = {}) => {
  return useQuery({
    queryKey: ["notas-credito", limit, offset, fechaInicio, fechaFin],
    queryFn: () =>
      ObtenerNotasCredito({
        limit,
        offset,
        fechaInicio,
        fechaFin,
      }),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetNotasCredito;
