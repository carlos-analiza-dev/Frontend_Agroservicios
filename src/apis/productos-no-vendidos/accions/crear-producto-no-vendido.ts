import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateProductosNoVendido } from "../interfaces/producto-no-vendido.interface";

export const CrearProductoNoVendido = async (
  data: CreateProductosNoVendido
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-no-vendidos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
