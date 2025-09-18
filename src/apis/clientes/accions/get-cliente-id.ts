import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Cliente } from "../interfaces/response-clientes.interface";

export const obtenerClienteById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/${id}`;
  const respose = await veterinariaAPI.get<Cliente>(url);
  return respose;
};
