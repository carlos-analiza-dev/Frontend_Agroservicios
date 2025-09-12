import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearDescuentoInsumoInterface } from "../interfaces/crear-descuento-insumo.interface";

export const ActualizarDescuentoInsumo = async (
  id: string,
  data: Partial<CrearDescuentoInsumoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-insumos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
