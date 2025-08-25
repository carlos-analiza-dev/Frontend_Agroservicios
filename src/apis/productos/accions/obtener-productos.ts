import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductos } from "../interfaces/response-productos.interface";

export const ObtenerProductos = async (
  limit: number,
  offset: number,
  pais: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos?limit=${limit}&offset=${offset}&pais=${pais}`;
  const response = await veterinariaAPI.get<ResponseProductos>(url);
  return response;
};

export default ObtenerProductos;
