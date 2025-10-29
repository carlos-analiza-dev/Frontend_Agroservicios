import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearHistorialInterface } from "../interface/crear-historial.interface";

export const ActualizarHistorial = async (
  id: string,
  data: Partial<CrearHistorialInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-clinico/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
