import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearImpuestoInterface } from "../interfaces/crear-impuesto.interface";

export const EditarDescuento = async (
  id: string,
  data: Partial<CrearImpuestoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-clientes/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
