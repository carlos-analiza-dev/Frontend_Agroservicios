import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCitaInterface } from "../interfaces/crear-cita.interface";

export const ActualizarCita = async (
  id: string,
  data: Partial<CrearCitaInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
