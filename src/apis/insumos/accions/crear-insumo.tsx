import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearInsumoInterface } from "../interfaces/crear-insumo.interface";

export const CrearInsumo = async (data: CrearInsumoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
