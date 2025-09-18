import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearClienteInterface } from "../interfaces/crear-cliente.interface";
import { Cliente } from "../interfaces/response-clientes.interface";

export const actualizarCliente = async (
  clienteId: string,
  data: Partial<CrearClienteInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/${clienteId}`;

  const response = await veterinariaAPI.patch<Cliente>(url, data);

  return response.data;
};
