import { ResponseCitasPendientesMedicosInterface } from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const ObtenerCitasConfirmadasByMedico = async (
  id: string,
  limit: number = 10,
  offset: number = 0
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/citas/medico/confirmada/${id}?limit=${limit}&offset=${offset}`;
  const response =
    await veterinariaAPI.get<ResponseCitasPendientesMedicosInterface>(url);
  return response.data;
};
