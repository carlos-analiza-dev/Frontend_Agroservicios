import { getRolesFilters } from "@/apis/roles/accions/all-roles";
import { useQuery } from "@tanstack/react-query";

const useGetRolesFilters = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["roles-filters", limit, offset],
    queryFn: () => getRolesFilters(limit, offset),
    staleTime: 30 * 60 * 1000,
    retry: 0,
  });
};

export default useGetRolesFilters;
