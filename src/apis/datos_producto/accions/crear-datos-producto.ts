import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearDatosProductoInterface } from "../interface/crear-datos-productos.interface";

export const CrearDatosProducto = async (data: CrearDatosProductoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-productos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
