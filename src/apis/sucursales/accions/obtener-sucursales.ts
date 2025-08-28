import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseSucursales } from "../interfaces/response-sucursales.interface";

export const ObtenerSucursales = async (
  limit: number = 10,
  offset: number = 0,
  pais: string = "",
  departamento: string = "",
  municipio: string = ""
) => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
  };

  if (pais && pais.trim() !== "") {
    params.paisId = pais;
  }

  if (departamento && departamento.trim() !== "") {
    params.departamentoId = departamento;
  }

  if (municipio && municipio.trim() !== "") {
    params.municipioId = municipio;
  }

  const queryString = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sucursales?${queryString}`;

  const response = await veterinariaAPI.get<ResponseSucursales>(url);
  return response.data;
};
