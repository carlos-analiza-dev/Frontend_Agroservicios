import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearRangoFacturaInterface } from "../interfaces/crear-rango-factura.interface";

export const ActuralizarRangoFactura = async (
  id: string,
  data: CrearRangoFacturaInterface
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/rangos-factura/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
