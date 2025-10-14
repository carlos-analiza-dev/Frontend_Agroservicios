import ObtenerProductosNoVendidos, {
  ObtenerProductosNoVendidosParams,
} from "@/apis/productos-no-vendidos/accions/obtener-productos-no-vendidos";
import { useQuery } from "@tanstack/react-query";

interface UseGetProductosParams extends ObtenerProductosNoVendidosParams {}

const useGetProductosNoVendidos = ({
  limit = 10,
  offset = 0,
  fechaInicio,
  fechaFin,
  sucursal,
}: UseGetProductosParams) => {
  return useQuery({
    queryKey: [
      "productos-no-vendidos",
      limit,
      offset,
      fechaInicio,
      fechaFin,
      sucursal,
    ],
    queryFn: () =>
      ObtenerProductosNoVendidos({
        limit,
        offset,
        fechaInicio,
        fechaFin,
        sucursal,
      }),
    retry: false,
    staleTime: 1000 * 60 * 2,
  });
};

export default useGetProductosNoVendidos;
