import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInsumosInterface } from "../interfaces/response-insumos.interface";

export const ObtenerInsumos = async (
  limit: number,
  offset: number,
  pais: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/insumos?limit=${limit}&offset=${offset}&pais=${pais}`;
  const response = await veterinariaAPI.get<ResponseInsumosInterface>(url);
  return response;
};

export default ObtenerInsumos;
