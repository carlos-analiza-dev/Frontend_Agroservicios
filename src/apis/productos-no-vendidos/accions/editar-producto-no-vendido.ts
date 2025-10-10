import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateProductosNoVendido } from "../interfaces/producto-no-vendido.interface";

export const ActualizarProductoNoVendido = async (
  id: string,
  data: Partial<CreateProductosNoVendido>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-no-vendidos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
