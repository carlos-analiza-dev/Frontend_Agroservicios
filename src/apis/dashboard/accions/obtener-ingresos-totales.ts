import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresosTotalesInterface } from "../interface/dashboard.interface";

export interface FiltrosIngresos {
  year?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export const ObtenerIngresosTotales = async (filtros: FiltrosIngresos = {}) => {
  const { year, fechaInicio, fechaFin } = filtros;
  const params = new URLSearchParams();

  if (year) {
    params.append("year", year);
  }

  if (fechaInicio) {
    params.append("fechaInicio", fechaInicio);
  }

  if (fechaFin) {
    params.append("fechaFin", fechaFin);
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/ingresos-totales?${params.toString()}`;

  const response = await veterinariaAPI.get<IngresosTotalesInterface>(url);

  return response.data;
};
