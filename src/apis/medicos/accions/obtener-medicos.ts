import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ObtenerMedicosInterface } from "../interfaces/obtener-medicos.interface";

export const ObtenerMedicos = async (
  limit: number,
  offset: number,
  name: string
) => {
  const url = `${
    process.env.NEXT_PUBLIC_API_UR
  }/medicos?limit=${limit}&offset=${offset}&name=${encodeURIComponent(name)}`;
  const response = await veterinariaAPI.get<ObtenerMedicosInterface>(url);
  return response.data;
};
