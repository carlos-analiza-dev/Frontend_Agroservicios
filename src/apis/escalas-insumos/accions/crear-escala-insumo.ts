import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEscalaInsumoInterface } from "../interfaces/crear-escala-insumo.interface";

export const CrearEscalaInsumo = async (data: CrearEscalaInsumoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
