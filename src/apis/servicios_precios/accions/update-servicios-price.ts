import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearServicePrecio } from "../interfaces/crear-servicio-precio.interface";

export const updateServicioPrecio = async (
  id: string,
  data: Partial<CrearServicePrecio>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-pais/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
