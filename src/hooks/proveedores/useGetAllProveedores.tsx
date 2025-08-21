import { ObtenerProveedores } from "@/apis/proveedores/accions/obtener-proveedores";
import { useQuery } from "@tanstack/react-query";

const useGetAllProveedores = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["proveedores", limit, offset],
    queryFn: () => ObtenerProveedores(limit, offset),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetAllProveedores;
