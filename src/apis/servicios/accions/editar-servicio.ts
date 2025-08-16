import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearServicio } from "../interfaces/crear-servicio.interface";

export const EditarServicio = async (
  id: string,
  data: Partial<CrearServicio>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
