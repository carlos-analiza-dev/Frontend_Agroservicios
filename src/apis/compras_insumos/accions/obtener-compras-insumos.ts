import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInsumosinteface } from "../interfaces/response-compras-insumos.interface";

export const ObtenerComprasInsumos = async (
  limit: number = 10,
  offset: number = 0,
  proveedor: string = "",
  sucursal: string = "",
  tipoPago: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-insumos?limit=${limit}&offset=${offset}&proveedor=${proveedor}&sucursal=${sucursal}&tipoPago=${tipoPago}`;

  const response = await veterinariaAPI.get<ResponseInsumosinteface>(url);
  return response.data;
};
