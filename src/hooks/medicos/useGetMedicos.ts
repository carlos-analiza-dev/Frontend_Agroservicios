import { ObtenerMedicos } from "@/apis/medicos/accions/obtener-medicos";
import { useQuery } from "@tanstack/react-query";

const useGetMedicos = (limit: number, page: number, name: string) => {
  return useQuery({
    queryKey: ["medicos", limit, page, name],
    queryFn: () => ObtenerMedicos(limit, (page - 1) * limit, name),
    retry: 0,
  });
};

export default useGetMedicos;
