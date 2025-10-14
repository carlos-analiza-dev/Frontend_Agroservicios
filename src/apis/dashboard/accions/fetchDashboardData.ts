import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { DashboardData } from "../interface/dashboard-data.interface";

export const fetchDashboardData = async (paisId: string = "") => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards?${paisId}`;

  const response = await veterinariaAPI.get<DashboardData>(url);
  return response.data;
};
