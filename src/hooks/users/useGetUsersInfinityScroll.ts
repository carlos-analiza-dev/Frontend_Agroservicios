import { obtenerUsuarios } from "@/apis/users/accions/obtener-usuarios";
import { useQuery } from "@tanstack/react-query";

const useGetUsersPagination = (
  debouncedSearchTerm: string,
  roleFilter: string,
  paisFilter: string,
  limit: number,
  page: number
) => {
  return useQuery({
    queryKey: [
      "usuarios-admin",
      debouncedSearchTerm,
      paisFilter,
      roleFilter,
      page,
    ],
    queryFn: () =>
      obtenerUsuarios(
        limit,
        (page - 1) * limit,
        debouncedSearchTerm,
        roleFilter,
        paisFilter
      ),
    retry: 0,
  });
};

export default useGetUsersPagination;
