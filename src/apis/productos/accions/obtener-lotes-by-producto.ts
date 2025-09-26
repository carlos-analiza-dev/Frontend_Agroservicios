import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseLotesByProductoInterface } from "../interfaces/response-lotes-producto.interface";

export const ObtenerLotesProducto = async (productoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/lotes/producto/${productoId}`;

  const response =
    await veterinariaAPI.get<ResponseLotesByProductoInterface[]>(url);
  return response.data;
};

export default ObtenerLotesProducto;
