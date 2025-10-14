import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TopProductosInterface } from "../interface/dashboard.interface";

export const ObtenerTopProductos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/top-productos-vendidos`;

  const response = await veterinariaAPI.get<TopProductosInterface[]>(url);

  return response.data;
};
