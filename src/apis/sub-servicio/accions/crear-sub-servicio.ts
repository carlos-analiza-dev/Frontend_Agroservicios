import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSubServicio } from "../interface/crear-sub-servicio.interface";

export const AddSubServicio = async (data: CrearSubServicio) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/servicio`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const AddProducto = async (data: CrearSubServicio) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/producto`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
