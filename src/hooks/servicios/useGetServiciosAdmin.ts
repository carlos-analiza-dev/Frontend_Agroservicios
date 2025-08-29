import { ObtenerServicio } from "@/apis/servicios/accions/obtener-servicios";
import { useQuery } from "@tanstack/react-query";

const useGetServiciosAdmin = (
  limit: number,
  offset: number,
  categoria: string
) => {
  return useQuery({
    queryKey: ["servicios-admin", limit, offset, categoria],
    queryFn: () => ObtenerServicio(limit, offset, categoria),
    retry: false,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetServiciosAdmin;
