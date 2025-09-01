import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductos } from "../interfaces/response-productos.interface";

export const ObtenerProductosDisponibles = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos-disponibles`;

  const response = await veterinariaAPI.get<ResponseProductos>(url);
  return response;
};

export default ObtenerProductosDisponibles;
