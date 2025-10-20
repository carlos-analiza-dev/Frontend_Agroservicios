import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPedidoInterface } from "../interface/crear-pedido.interface";

export const EditarPedido = async (
  id: string,
  data: Partial<CrearPedidoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
