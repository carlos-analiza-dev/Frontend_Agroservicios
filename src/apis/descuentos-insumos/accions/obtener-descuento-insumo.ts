import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseDescuentosInsumosInterface } from "../interfaces/response-descuentos-insumo.interface";

export const ObtenerDescuentosInsumo = async (insumoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-insumos/insumo/${insumoId}`;

  const response =
    await veterinariaAPI.get<ResponseDescuentosInsumosInterface[]>(url);
  return response.data;
};
