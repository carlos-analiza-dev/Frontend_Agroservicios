import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearRangoFacturaInterface } from "../interfaces/crear-rango-factura.interface";

export const CrearRangoFactura = async (data: CrearRangoFacturaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rangos-factura`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
