import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Animal } from "../interfaces/response-animales.interface";

export const ObtenerAnimalesByFincaEspRaza = async (
  fincaId: string,
  especieId: string,
  razaId: string
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/animales/${fincaId}/${especieId}/${razaId}`;

  const response = await veterinariaAPI.get<Animal[]>(url);

  return response;
};
