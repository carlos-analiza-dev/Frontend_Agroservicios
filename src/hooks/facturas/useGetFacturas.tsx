import { ObtenerFacturas } from "@/apis/facturas/accions/obtener-facturas-pais";
import { useQuery } from "@tanstack/react-query";

interface UseGetFacturasProps {
  limit?: number;
  offset?: number;
  sucursal?: string;
  fechaInicio?: string;
  fechaFin?: string;
  enabled?: boolean;
}

const useGetFacturas = ({
  limit = 10,
  offset = 0,
  sucursal,
  fechaInicio,
  fechaFin,
  enabled = true,
}: UseGetFacturasProps = {}) => {
  return useQuery({
    queryKey: ["facturas", limit, offset, sucursal, fechaInicio, fechaFin],
    queryFn: () =>
      ObtenerFacturas({
        limit,
        offset,
        sucursal,
        fechaInicio,
        fechaFin,
      }),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled,
  });
};

export default useGetFacturas;
