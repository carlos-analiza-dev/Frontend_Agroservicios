import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateMunicipio } from "../interfaces/create-municipio.interface";

export const CrearMunicipio = async (data: CreateMunicipio) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/municipios-departamentos-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
