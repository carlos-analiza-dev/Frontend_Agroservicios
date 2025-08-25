import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCatInterface } from "../interface/crear-categoria.interface";

export const CrearCategoria = async (data: CrearCatInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
