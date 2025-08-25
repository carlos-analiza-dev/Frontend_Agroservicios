import { ObtenerSubCategorias } from "@/apis/subcategorias/accions/get-subcategorias";
import { useQuery } from "@tanstack/react-query";

const useGetSubCategorias = () => {
  return useQuery({
    queryKey: ["subcategorias"],
    queryFn: ObtenerSubCategorias,
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetSubCategorias;
