import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseFacturasInterface } from "../interfaces/response-facturas.interface";

interface FiltrosFacturas {
  limit?: number;
  offset?: number;
  sucursal?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export const ObtenerFacturas = async (filtros: FiltrosFacturas = {}) => {
  const { limit = 10, offset = 0, sucursal, fechaInicio, fechaFin } = filtros;
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (sucursal) {
    params.append("sucursal", sucursal);
  }

  if (fechaInicio) {
    params.append("fechaInicio", fechaInicio);
  }

  if (fechaFin) {
    params.append("fechaFin", fechaFin);
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseFacturasInterface>(url);
  return response.data;
};
