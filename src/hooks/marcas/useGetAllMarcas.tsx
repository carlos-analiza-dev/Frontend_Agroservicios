import { ObtenerMarcas } from "@/apis/marcas/accions/obtener-marcas";
import { useQuery } from "@tanstack/react-query";

const useGetAllMarcas = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["marcas", limit, offset],
    queryFn: () => ObtenerMarcas(limit, offset),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetAllMarcas;
