import { ObtenerUsuariosActivos } from "@/apis/dashboard/accions/obtener-usuarios-activos";
import { useQuery } from "@tanstack/react-query";

const useGetUsuariosActivos = () => {
  return useQuery({
    queryKey: ["usuarios-activos"],
    queryFn: ObtenerUsuariosActivos,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export default useGetUsuariosActivos;
