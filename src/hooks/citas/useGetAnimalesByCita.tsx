import { ObtenerAnimalesByCita } from "@/apis/citas/accions/obtener-animales-cita";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalesByCita = (id: string) => {
  return useQuery({
    queryKey: ["animales-cita", id],
    queryFn: () => ObtenerAnimalesByCita(id),
    enabled: !!id,
    retry: 0,
  });
};

export default useGetAnimalesByCita;
