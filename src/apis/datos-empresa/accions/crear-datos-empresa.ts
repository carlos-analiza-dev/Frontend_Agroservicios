import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreatDatosEmpresaInterface } from "../interfaces/crear-datos-empresa.interface";

export const CrearDatosEmpresa = async (data: CreatDatosEmpresaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-empresa`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
