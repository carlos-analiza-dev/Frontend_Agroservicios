import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseHistorialVetInterface } from "../interface/response-historial-veterinario.interface";

interface FiltrosHistorial {
  limit?: number;
  offset?: number;
  veterinario?: string;
  fechaInicio?: string;
  fechaFin?: string;
  identificador?: string;
  fincaNombre?: string;
}

export const ObtenerHistorialVeterinario = async (
  filtros: FiltrosHistorial = {}
) => {
  const {
    limit = 10,
    offset = 0,
    veterinario,
    fechaInicio,
    fechaFin,
    identificador,
    fincaNombre,
  } = filtros;

  const params = new URLSearchParams();

  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
  if (identificador) params.append("identificador", identificador);
  if (fincaNombre) params.append("fincaNombre", fincaNombre);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-clinico/${veterinario}?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseHistorialVetInterface>(url);
  return response.data;
};
