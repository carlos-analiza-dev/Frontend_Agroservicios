import { ObtenerSucursalesPais } from "@/apis/sucursales/accions/obtener-sucursales-pais";
import { useQuery } from "@tanstack/react-query";

const useGetSucursalesPais = (paisId: string) => {
  return useQuery({
    queryKey: ["sucursales-pais", paisId],
    queryFn: () => ObtenerSucursalesPais(paisId),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!paisId,
  });
};

export default useGetSucursalesPais;
