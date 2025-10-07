import { obtenerClientesActivos } from "@/apis/clientes/accions/obtener-clientes";
import { useQuery } from "@tanstack/react-query";

const useGetClientesActivos = () => {
  return useQuery({
    queryKey: ["clientes-activos"],
    queryFn: () => obtenerClientesActivos(),
    retry: 0,
  });
};

export default useGetClientesActivos;
