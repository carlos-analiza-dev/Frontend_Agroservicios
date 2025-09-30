import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseLotesInsumoInterface } from "../interfaces/response-lotes-insumo.interface";

export const ObtenerLotesInsumo = async (insumoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-insumos/insumo/${insumoId}`;

  const response =
    await veterinariaAPI.get<ResponseLotesInsumoInterface[]>(url);
  return response.data;
};

export default ObtenerLotesInsumo;
