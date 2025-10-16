import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCitaInterface } from "../interfaces/crear-cita.interface";

export const CreateCita = async (data: CrearCitaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
