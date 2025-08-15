import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreatePais } from "../interfaces/crear-pais.interface";

export const CrearPaises = async (data: CreatePais) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
