import ObtenerInsumosDisponibles from "@/apis/insumos/accions/obtener-insumos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetInsumosDisponibles = () => {
  return useQuery({
    queryKey: ["insumos-disponibles"],
    queryFn: () => ObtenerInsumosDisponibles(),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetInsumosDisponibles;
