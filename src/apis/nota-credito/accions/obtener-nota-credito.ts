import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseNotaCreditoInterface } from "../interface/response-nota-credito.interface";

interface FiltrosNotaCredico {
  limit?: number;
  offset?: number;
}

export const ObtenerNotasCredito = async (filtros: FiltrosNotaCredico = {}) => {
  const { limit = 10, offset = 0 } = filtros;
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseNotaCreditoInterface>(url);
  return response.data;
};
