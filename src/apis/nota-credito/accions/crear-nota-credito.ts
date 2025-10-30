import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearNotaCreditoInterface } from "../interface/crear-nota-credito.interface";

export const CrearNotaCredito = async (data: CrearNotaCreditoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/nota-credito`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
