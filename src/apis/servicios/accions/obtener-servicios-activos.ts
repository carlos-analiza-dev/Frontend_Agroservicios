import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Servicio } from "../interfaces/response-servicios.interface";

export const getServiciosActivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/servicios/activos`;

  const response = await veterinariaAPI.get<Servicio[]>(url);
  return response.data;
};
