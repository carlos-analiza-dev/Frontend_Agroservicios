import { ObtenerMarcasActivas } from "@/apis/marcas/accions/obtener-marcas-activas";
import { useQuery } from "@tanstack/react-query";

const useGetMarcasActivas = () => {
  return useQuery({
    queryKey: ["marcas-activas"],
    queryFn: ObtenerMarcasActivas,
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetMarcasActivas;
