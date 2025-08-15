import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearServicio } from "../interfaces/crear-servicio.interface";

export const AddServicio = async (data: CrearServicio) => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/servicios`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
