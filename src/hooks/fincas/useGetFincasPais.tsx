import { obtenerFincasPais } from "@/apis/fincas/accions/obtener-fincas-pais";
import { useQuery } from "@tanstack/react-query";

interface UseGetFincas {
  name?: string;
  enabled?: boolean;
}

const useGetFincasPais = ({ name, enabled = true }: UseGetFincas = {}) => {
  return useQuery({
    queryKey: ["fincas-pais", name],
    queryFn: () =>
      obtenerFincasPais({
        name,
      }),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled,
  });
};

export default useGetFincasPais;
