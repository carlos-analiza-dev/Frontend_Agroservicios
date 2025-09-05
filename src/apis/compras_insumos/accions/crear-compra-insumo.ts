import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCompraInsumoInterface } from "../interfaces/crear-compra-insumos.interface";

export const CrearCompraInsumo = async (data: CrearCompraInsumoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
