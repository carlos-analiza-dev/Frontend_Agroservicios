import { ObtenerUsuariosActivos } from "@/apis/dashboard/accions/obtener-usuarios-activos";
import { useQuery } from "@tanstack/react-query";

const useGetUsuariosActivos = () => {
  return useQuery({
    queryKey: ["usuarios-activos"],
    queryFn: ObtenerUsuariosActivos,
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetUsuariosActivos;
