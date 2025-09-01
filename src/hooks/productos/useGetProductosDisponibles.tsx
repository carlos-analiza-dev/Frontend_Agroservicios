import ObtenerProductosDisponibles from "@/apis/productos/accions/obtener-productos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetProductosDisponibles = () => {
  return useQuery({
    queryKey: ["productos-disponibles"],
    queryFn: () => ObtenerProductosDisponibles(),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetProductosDisponibles;
