import { ObtenerSucursales } from "@/apis/sucursales/accions/obtener-sucursales";
import { useQuery } from "@tanstack/react-query";

const useGetSucursales = (
  limit: number = 10,
  offset: number = 0,
  pais: string = "",
  departamento: string = "",
  municipio: string = ""
) => {
  return useQuery({
    queryKey: ["sucursales", limit, offset, pais, departamento, municipio],
    queryFn: () =>
      ObtenerSucursales(limit, offset, pais, departamento, municipio),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetSucursales;
