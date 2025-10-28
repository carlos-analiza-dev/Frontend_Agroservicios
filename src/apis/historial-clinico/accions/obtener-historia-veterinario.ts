import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseHistorialVetInterface } from "../interface/response-historial-veterinario.interface";

interface FiltrosFacturas {
  limit?: number;
  offset?: number;
  veterinario?: string;
}

export const ObtenerHistorialVeterinario = async (
  filtros: FiltrosFacturas = {}
) => {
  const { limit = 10, offset = 0, veterinario } = filtros;
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-clinico/${veterinario}?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseHistorialVetInterface>(url);
  return response.data;
};
