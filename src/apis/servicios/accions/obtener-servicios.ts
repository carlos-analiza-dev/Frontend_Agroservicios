import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseServicios } from "../interfaces/response-servicios.interface";

export const ObtenerServicio = async (limit: number, offset: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/servicios?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseServicios>(url);
  return response;
};

export const getServicios = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/servicios`;

  const response = await veterinariaAPI.get<ResponseServicios>(url);
  return response.data.servicios;
};
