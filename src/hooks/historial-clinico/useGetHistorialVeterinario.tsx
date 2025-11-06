import { ObtenerHistorialVeterinario } from "@/apis/historial-clinico/accions/obtener-historia-veterinario";
import { useQuery } from "@tanstack/react-query";

interface UseGetHistorial {
  limit?: number;
  offset?: number;
  veterinario?: string;
  fechaInicio?: string;
  fechaFin?: string;
  identificador?: string;
  fincaNombre?: string;
}

const useGetHistorialVeterinario = ({
  limit = 10,
  offset = 0,
  veterinario,
  fechaInicio,
  fechaFin,
  identificador,
  fincaNombre,
}: UseGetHistorial = {}) => {
  return useQuery({
    queryKey: [
      "historial-clinico",
      limit,
      offset,
      veterinario,
      fechaInicio,
      fechaFin,
      identificador,
      fincaNombre,
    ],
    queryFn: () =>
      ObtenerHistorialVeterinario({
        limit,
        offset,
        veterinario,
        fechaInicio,
        fechaFin,
        identificador,
        fincaNombre,
      }),
    enabled: !!veterinario,
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetHistorialVeterinario;
