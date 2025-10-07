import { ObtenerFacturas } from "@/apis/facturas/accions/obtener-facturas-pais";
import { useQuery } from "@tanstack/react-query";

const useGetFacturas = (limit: number = 10, offset: number) => {
  return useQuery({
    queryKey: ["facturas", limit, offset],
    queryFn: () => ObtenerFacturas(limit, offset),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetFacturas;
