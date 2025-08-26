import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInventariosInsumos } from "../interfaces/response-inventarios-insumos.interface";

export const ObtenerInventarios = async (
  limit: number,
  offset: number,
  pais: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/inventario?limit=${limit}&offset=${offset}&pais=${pais}`;
  const response = await veterinariaAPI.get<ResponseInventariosInsumos>(url);
  return response;
};

export default ObtenerInventarios;
