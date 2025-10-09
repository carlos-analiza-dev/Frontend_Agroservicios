import { ObtenerDescuentosByPais } from "@/apis/descuentos-clientes/accions/obtener-descuentos-pais";
import { useQuery } from "@tanstack/react-query";

const useGetDescuentosClientes = () => {
  return useQuery({
    queryKey: ["descuentos-clientes"],
    queryFn: ObtenerDescuentosByPais,
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetDescuentosClientes;
