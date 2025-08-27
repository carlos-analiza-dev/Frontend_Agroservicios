import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearInsumoInterface } from "../interfaces/crear-insumo.interface";

export const EditarInsumo = async (
  id: string,
  data: Partial<CrearInsumoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/insumos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
