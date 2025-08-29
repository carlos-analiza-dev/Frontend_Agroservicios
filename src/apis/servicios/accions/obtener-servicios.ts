import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseServicios } from "../interfaces/response-servicios.interface";

export const ObtenerServicio = async (
  limit: number,
  offset: number,
  categoria: string
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios?limit=${limit}&offset=${offset}&servicio=${categoria}`;

  const response = await veterinariaAPI.get<ResponseServicios>(url);
  return response;
};

export const getServicios = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios`;

  const response = await veterinariaAPI.get<ResponseServicios>(url);
  return response.data.servicios;
};
