import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ObtenerTiempoInterface } from "../interfaces/response-obtener-tiempo";

export const obtenerTiempoViajeGoogleMaps = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/google-maps/tiempo?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}&modo=driving`;

  const response = await veterinariaAPI.get<ObtenerTiempoInterface>(url);
  return response.data;
};
