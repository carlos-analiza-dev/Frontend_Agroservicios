import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCompraInterface } from "../interface/crear-compra.interface";

export const CrearCompra = async (data: CrearCompraInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compras`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
