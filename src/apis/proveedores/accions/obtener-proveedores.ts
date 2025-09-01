import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProveedores } from "../interfaces/response-proveedores.interface";

export const ObtenerProveedores = async (
  paisId: string,
  limit: number = 10,
  offset: number = 0
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/proveedores/pais/${paisId}?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseProveedores>(url);
  return response.data;
};
