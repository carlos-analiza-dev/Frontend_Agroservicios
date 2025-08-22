import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Marca } from "../interface/response-marcas.interface";

export const ObtenerMarcasActivas = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marcas/activas`;

  const response = await veterinariaAPI.get<Marca[]>(url);
  return response.data;
};
