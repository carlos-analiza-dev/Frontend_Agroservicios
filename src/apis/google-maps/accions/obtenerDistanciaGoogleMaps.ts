import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const obtenerDistanciaGoogleMaps = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/google-maps/distancia?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}&modo=driving`;

  const response = await veterinariaAPI.get<number>(url);
  return response.data;
};
