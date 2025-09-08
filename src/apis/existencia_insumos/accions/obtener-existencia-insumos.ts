import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseExistenciaInsumosInterface } from "../interfaces/response-exsistencia-insumos.interface";

export const obtenerExistenciaInsumos = async (
  insumo?: string,
  sucursal?: string
) => {
  const params = new URLSearchParams();

  if (insumo) params.append("insumo", insumo);
  if (sucursal) params.append("sucursal", sucursal);

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/compra-insumos/existencias-insumos${queryString ? `?${queryString}` : ""}`;

  const response =
    await veterinariaAPI.get<ResponseExistenciaInsumosInterface[]>(url);
  return response.data;
};
