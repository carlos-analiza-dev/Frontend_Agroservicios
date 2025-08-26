import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearInventarioInsumoInterface } from "../interfaces/crear-inventario-insumo.interface";

export const CrearInventario = async (data: CrearInventarioInsumoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/inventario`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
