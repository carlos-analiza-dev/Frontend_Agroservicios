import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearDescuentoInsumoInterface } from "../interfaces/crear-descuento-insumo.interface";

export const CrearDescuentoInsumo = async (
  data: CrearDescuentoInsumoInterface
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
