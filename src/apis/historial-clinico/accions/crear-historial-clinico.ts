import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearHistorialInterface } from "../interface/crear-historial.interface";

export const CrearHistorial = async (data: CrearHistorialInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-clinico`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
