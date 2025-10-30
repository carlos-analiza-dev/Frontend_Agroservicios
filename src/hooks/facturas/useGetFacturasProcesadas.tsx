import { ObtenerFacturasProcesadas } from "@/apis/facturas/accions/obtener-facturas-procesadas-pais";
import { useQuery } from "@tanstack/react-query";

interface UseGetFacturasProps {
  sucursal?: string;
  enabled?: boolean;
}

const useGetFacturasProcesadas = ({
  sucursal,
  enabled = true,
}: UseGetFacturasProps = {}) => {
  return useQuery({
    queryKey: ["facturas-procesadas", sucursal],
    queryFn: () =>
      ObtenerFacturasProcesadas({
        sucursal,
      }),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled,
  });
};

export default useGetFacturasProcesadas;
