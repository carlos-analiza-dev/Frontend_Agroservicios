import ObtenerSubServiciosDisponibles from "@/apis/servicios/accions/obtener-subservicio-disponible";
import { useQuery } from "@tanstack/react-query";

const useGetServiciosDisponibles = () => {
  return useQuery({
    queryKey: ["servicios-disponibles"],
    queryFn: () => ObtenerSubServiciosDisponibles(),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetServiciosDisponibles;
