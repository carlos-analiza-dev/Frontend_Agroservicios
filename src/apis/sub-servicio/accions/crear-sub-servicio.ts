import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSubServicio } from "../interface/crear-producto.interface";
import { CrearServicioInterface } from "../interface/crear-servicio.interface";

export const AddSubServicio = async (data: CrearServicioInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/servicio`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const AddProducto = async (data: CrearSubServicio) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/producto`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
