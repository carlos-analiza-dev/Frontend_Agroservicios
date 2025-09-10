import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDatosProductoInterface } from "../interface/response-datos-producto";

export const ObtenerDatosProducto = async (
  limit: number = 10,
  offset: number = 0,
  producto: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-productos/producto/${producto}?limit=${limit}&offset=${offset}`;

  const response =
    await veterinariaAPI.get<ResponseDatosProductoInterface>(url);
  return response.data;
};
