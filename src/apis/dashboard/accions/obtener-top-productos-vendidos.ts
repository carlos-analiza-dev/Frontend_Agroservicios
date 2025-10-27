import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TopProductosInterface } from "../interface/dashboard.interface";
import { FiltrosIngresos } from "./obtener-ingresos-totales";

export const ObtenerTopProductos = async (filtros: FiltrosIngresos = {}) => {
  const { fechaInicio, fechaFin } = filtros;
  const params = new URLSearchParams();

  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/top-productos-vendidos?${params.toString()}`;

  const response = await veterinariaAPI.get<TopProductosInterface[]>(url);

  return response.data;
};
