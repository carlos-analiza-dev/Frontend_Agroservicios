import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseMarcas } from "../interface/response-marcas.interface";

export const ObtenerMarcas = async (limit: number = 10, offset: number = 0) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marcas?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseMarcas>(url);
  return response.data;
};
