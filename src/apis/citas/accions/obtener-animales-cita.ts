import { Animal } from "@/apis/animales/interfaces/response-animales.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const ObtenerAnimalesByCita = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas/animales/${id}`;
  const response = await veterinariaAPI.get<Animal[]>(url);
  return response.data;
};
