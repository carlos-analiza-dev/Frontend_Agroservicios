import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseNotaCreditoInterface } from "../interface/response-nota-credito.interface";

interface FiltrosNotaCredito {
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export const ObtenerNotasCredito = async (filtros: FiltrosNotaCredito = {}) => {
  const { limit = 10, offset = 0, fechaInicio, fechaFin } = filtros;

  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseNotaCreditoInterface>(url);
  return response.data;
};
