import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCatInterface } from "../interface/crear-categoria.interface";

export const ActualizarCategoria = async (
  id: string,
  data: Partial<CrearCatInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
