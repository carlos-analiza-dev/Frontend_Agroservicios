import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearHoarioInterface } from "../interface/crear-horario.interface";

export const CrearHorario = async (data: CrearHoarioInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/horarios-medicos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
