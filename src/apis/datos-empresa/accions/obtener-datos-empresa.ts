import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { DatosEmpresaInterface } from "../interfaces/obtener-datos-empresa.interface";

export const ObtenerDatosEmpresa = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-empresa`;

  const response = await veterinariaAPI.get<DatosEmpresaInterface>(url);
  return response.data;
};
