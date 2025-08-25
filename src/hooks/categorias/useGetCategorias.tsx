import { ObtenerCategorias } from "@/apis/categorias/accions/get-categorias";
import { useQuery } from "@tanstack/react-query";

const useGetCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: ObtenerCategorias,
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetCategorias;
