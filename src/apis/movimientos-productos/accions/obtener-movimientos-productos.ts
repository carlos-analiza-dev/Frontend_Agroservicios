import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseMovimientosProductosInterface } from "../interfaces/response-movimientos-productos.interface";

export interface ObtenerMovimientosProductosParams {
  sucursalId: string;
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export const ObtenerMovimientosProductos = async ({
  sucursalId,
  limit = 10,
  offset = 0,
  fechaInicio,
  fechaFin,
}: ObtenerMovimientosProductosParams) => {
  const params = new URLSearchParams();

  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/movimientos-lote/sucursal/${sucursalId}?${params.toString()}`;

  const response =
    await veterinariaAPI.get<ResponseMovimientosProductosInterface>(url);
  return response.data;
};

export default ObtenerMovimientosProductos;
