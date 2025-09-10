import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearDatosProductoInterface } from "../interface/crear-datos-productos.interface";

export const ActualizarDatosProducto = async (
  id: string,
  data: Partial<CrearDatosProductoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-productos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
