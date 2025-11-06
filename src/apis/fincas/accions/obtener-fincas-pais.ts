import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseFincasInterface } from "../interface/response-fincas.interface";

interface FiltrosFincas {
  name?: string;
}

export const obtenerFincasPais = async (filtros: FiltrosFincas = {}) => {
  const { name } = filtros;
  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/fincas-ganadero/pais?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseFincasInterface>(url);
  return response.data;
};
