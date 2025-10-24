import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateCitaInsumoInterface } from "../interface/create-cita-insumo.interface";

export const CreateCitaInsumo = async (data: CreateCitaInsumoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cita-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
