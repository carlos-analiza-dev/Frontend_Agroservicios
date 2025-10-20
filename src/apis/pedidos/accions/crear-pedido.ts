import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPedidoInterface } from "../interface/crear-pedido.interface";

export const CrearPedido = async (data: CrearPedidoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pedidos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
