import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearFacturaInterface } from "../interfaces/crear-factura.interface";

export type EditarFacturaInterface = Partial<CrearFacturaInterface>;

export const AutorizarCancelacionFactura = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado/${id}/autorizar-cancelacion`;

  const response = await veterinariaAPI.patch(url, {});
  return response;
};
