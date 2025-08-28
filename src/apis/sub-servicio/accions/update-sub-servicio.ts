import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSubServicio } from "../interface/crear-sub-servicio.interface";

export const UpdateSubServicio = async (
  id: string,
  data: Partial<CrearSubServicio>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/servicio/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const UpdateProducto = async (
  id: string,
  data: Partial<CrearSubServicio>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/producto/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
