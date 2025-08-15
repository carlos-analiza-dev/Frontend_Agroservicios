import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaisesResponse } from "../interfaces/paises.response.interface";

export const obtenerPaises = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pais`;

  const response = await veterinariaAPI.get<PaisesResponse[]>(url);
  return response;
};

export const obtenerPaisesActivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pais/activos`;

  const response = await veterinariaAPI.get<PaisesResponse[]>(url);
  return response;
};
