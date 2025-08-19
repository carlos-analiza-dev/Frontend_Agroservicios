import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearServicePrecio } from "../interfaces/crear-servicio-precio.interface";

export const AddServicioPrecio = async (data: CrearServicePrecio) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
