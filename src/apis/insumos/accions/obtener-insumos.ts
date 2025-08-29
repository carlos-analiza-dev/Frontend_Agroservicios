import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInsumosInterface } from "../interfaces/response-insumos.interface";

export const ObtenerInsumos = async (
  limit: number,
  offset: number,
  pais: string = "",
  proveedor: string = "",
  marca: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/insumos?limit=${limit}&offset=${offset}&pais=${pais}&proveedor=${proveedor}&marca=${marca}`;
  const response = await veterinariaAPI.get<ResponseInsumosInterface>(url);
  return response;
};

export default ObtenerInsumos;
