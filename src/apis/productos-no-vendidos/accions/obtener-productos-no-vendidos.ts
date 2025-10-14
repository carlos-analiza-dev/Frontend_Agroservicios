import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductosNoVendidosInterface } from "../interfaces/response-productos-no-vendidos.interface";

export interface ObtenerProductosNoVendidosParams {
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
  sucursal?: string;
}

export const ObtenerProductosNoVendidos = async ({
  limit = 10,
  offset = 0,
  fechaInicio,
  fechaFin,
  sucursal,
}: ObtenerProductosNoVendidosParams) => {
  const params = new URLSearchParams();

  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
  if (sucursal) params.append("sucursal", sucursal);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-no-vendidos?${params.toString()}`;

  const response =
    await veterinariaAPI.get<ResponseProductosNoVendidosInterface>(url);
  return response.data;
};

export default ObtenerProductosNoVendidos;
