import { ObtenerMovimientosProductos } from "@/apis/movimientos-productos/accions/obtener-movimientos-productos";
import { useQuery } from "@tanstack/react-query";

const useGetMovimientosProductos = (
  sucursalId: string,
  limit: number,
  page: number,
  fechaInicio?: string,
  fechaFin?: string
) => {
  return useQuery({
    queryKey: [
      "movimientos-productos",
      sucursalId,
      limit,
      page,
      fechaInicio,
      fechaFin,
    ],
    queryFn: () =>
      ObtenerMovimientosProductos({
        sucursalId,
        limit,
        offset: (page - 1) * limit,
        fechaInicio,
        fechaFin,
      }),
    retry: 0,
    enabled: !!sucursalId,
  });
};

export default useGetMovimientosProductos;
