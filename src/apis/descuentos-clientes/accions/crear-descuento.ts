import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearImpuestoInterface } from "../interfaces/crear-impuesto.interface";

export const CrearDescuento = async (data: CrearImpuestoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-clientes`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
