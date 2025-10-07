import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearFacturaInterface } from "../interfaces/crear-factura.interface";

export const CrearFactura = async (data: CrearFacturaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
