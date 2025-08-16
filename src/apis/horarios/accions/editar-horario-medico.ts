import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearHoarioInterface } from "../interface/crear-horario.interface";

export const UpdateHorario = async (
  id: string,
  data: Partial<CrearHoarioInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/horarios-medicos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
