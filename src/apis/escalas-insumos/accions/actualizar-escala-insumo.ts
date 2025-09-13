import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEscalaInsumoInterface } from "../interfaces/crear-escala-insumo.interface";

export const ActualizarEscalaInsumo = async (
  id: string,
  data: Partial<CrearEscalaInsumoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-insumos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
