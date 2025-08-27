import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearServicioInsumoInterface } from "../interfaces/crear-servicio-insumo.interface";

export const CrearServicioInsumos = async (
  data: CrearServicioInsumoInterface
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicio-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
