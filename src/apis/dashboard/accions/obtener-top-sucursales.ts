import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TopSucursalesInterface } from "../interface/dashboard.interface";

export const ObtenerTopSucursales = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/top-sucursales`;

  const response = await veterinariaAPI.get<TopSucursalesInterface[]>(url);

  return response.data;
};
