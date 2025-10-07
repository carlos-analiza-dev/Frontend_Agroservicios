import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseFacturasInterface } from "../interfaces/response-facturas.interface";

export const ObtenerFacturas = async (
  limit: number = 10,
  offset: number = 0
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseFacturasInterface>(url);
  return response.data;
};
