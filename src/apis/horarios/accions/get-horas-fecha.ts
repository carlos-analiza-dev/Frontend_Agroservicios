import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseHorasMedicoInterface } from "../interface/horas-disponibles-medico";

export const ObtenerHorasByFecha = async (
  medicoId: string,
  fecha: string,
  duracion: string
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas/horarios/disponibles?medicoId=${medicoId}&fecha=${fecha}&duracionServicioHoras=${duracion}`;

  const response =
    await veterinariaAPI.get<ResponseHorasMedicoInterface[]>(url);
  return response.data;
};
