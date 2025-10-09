import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearFacturaInterface } from "../interfaces/crear-factura.interface";

export type EditarFacturaInterface = Partial<CrearFacturaInterface>;

export const CancelarFactura = async (
  id: string,
  data: EditarFacturaInterface
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado/${id}/cancelar`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
