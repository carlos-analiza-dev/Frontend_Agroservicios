import ObtenerInsumosDisponibles from "@/apis/insumos/accions/obtener-insumos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetInsumosDisponibles = () => {
  return useQuery({
    queryKey: ["insumos-disponibles"],
    queryFn: ObtenerInsumosDisponibles,
    retry: false,
  });
};

export default useGetInsumosDisponibles;
