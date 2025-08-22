import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateMarcaInterface } from "../interface/crear-marca.interface";

export const CrearMarca = async (data: CreateMarcaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marcas`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
