import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseClientesInterface } from "../interfaces/response-clientes.interface";

export const obtenerClientes = async (
  limit: number = 10,
  offset: number = 0,
  nombre: string = "",
  pais: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/clientes?limit=${limit}&offset=${offset}&name=${nombre}&pais=${pais}`;

  const respose = await veterinariaAPI.get<ResponseClientesInterface>(url);
  return respose;
};
