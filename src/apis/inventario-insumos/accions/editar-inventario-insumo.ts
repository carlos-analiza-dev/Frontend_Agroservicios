import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearInventarioInsumoInterface } from "../interfaces/crear-inventario-insumo.interface";

export const EditarInventario = async (
  id: string,
  data: Partial<CrearInventarioInsumoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/inventario/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
