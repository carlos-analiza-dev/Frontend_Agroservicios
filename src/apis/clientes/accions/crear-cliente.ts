import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearClienteInterface } from "../interfaces/crear-cliente.interface";

export const CreateCliente = async (data: CrearClienteInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/register`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
