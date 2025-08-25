import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseSubcategorias } from "../interface/get-subcategorias.interface";

export const ObtenerSubCategorias = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/subcategorias`;

  const response = await veterinariaAPI.get<ResponseSubcategorias[]>(url);
  return response.data;
};
