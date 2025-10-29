import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCitasCompletadasInterface } from "../interfaces/response-citas-no-paginadas.interface";

export const ObtenerCitasCompletadas = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas/completadas/${id}`;
  const response =
    await veterinariaAPI.get<ResponseCitasCompletadasInterface>(url);
  return response.data;
};
