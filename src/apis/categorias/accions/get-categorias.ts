import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCategoriasInterface } from "../interface/response-categorias.interface";

export const ObtenerCategorias = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

  const response = await veterinariaAPI.get<ResponseCategoriasInterface[]>(url);
  return response.data;
};
