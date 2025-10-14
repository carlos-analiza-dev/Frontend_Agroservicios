import { fetchDashboardData } from "@/apis/dashboard/accions/fetchDashboardData";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

const useDashboardData = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id;
  return useQuery({
    queryKey: ["dashboard-data", paisId],
    queryFn: () => fetchDashboardData(paisId),
    refetchInterval: 300000,
    staleTime: 1000 * 60 * 5,
  });
};

export default useDashboardData;
