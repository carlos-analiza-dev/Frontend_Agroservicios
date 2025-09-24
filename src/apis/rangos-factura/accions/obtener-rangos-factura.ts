import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseRangosFacturaInterface } from "../interfaces/response-rangos-factura.interface";

export const ObtenerRangosFactura = async (limit: number, offset: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rangos-factura?limit=${limit}&offset=${offset}`;

  const response =
    await veterinariaAPI.get<ResponseRangosFacturaInterface>(url);
  return response.data;
};
