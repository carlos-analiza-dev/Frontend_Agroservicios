import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreatDatosEmpresaInterface } from "../interfaces/crear-datos-empresa.interface";

export const ActualizarDatosEmpresa = async (
  id: string,
  data: Partial<CreatDatosEmpresaInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/datos-empresa/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
