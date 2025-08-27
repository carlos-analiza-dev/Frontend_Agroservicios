import { ObtenerTaxesByPais } from "@/apis/impuestos/accions/obtener-taxes-pais";
import { useQuery } from "@tanstack/react-query";

const useGetTaxesPais = () => {
  return useQuery({
    queryKey: ["taxes"],
    queryFn: ObtenerTaxesByPais,
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetTaxesPais;
