import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearFacturaInterface } from "../interfaces/crear-factura.interface";

export const EditarFactura = async (
  id: string,
  data: Partial<CrearFacturaInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
