import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseHistorialVetInterface } from "../interface/response-historial-veterinario.interface";

interface FiltrosHistorial {
  animalId?: string;
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export const ObtenerHistorialAnimal = async (
  filtros: FiltrosHistorial = {}
) => {
  const { animalId, limit = 10, offset = 0, fechaInicio, fechaFin } = filtros;

  const params = new URLSearchParams();

  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-clinico/animales/${animalId}?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseHistorialVetInterface>(url);
  return response.data;
};
