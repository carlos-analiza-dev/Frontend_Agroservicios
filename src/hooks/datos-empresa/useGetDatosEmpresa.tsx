import { ObtenerDatosEmpresa } from "@/apis/datos-empresa/accions/obtener-datos-empresa";
import { useQuery } from "@tanstack/react-query";

const useGetDatosEmpresa = () => {
  return useQuery({
    queryKey: ["datos-empresa"],
    queryFn: ObtenerDatosEmpresa,
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetDatosEmpresa;
