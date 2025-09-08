import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseExistenciaProductosInterface } from "../interfaces/response-existencia-productos.interface";

export const obtenerExistenciaProductos = async (
  producto?: string,
  sucursal?: string
) => {
  const params = new URLSearchParams();

  if (producto) params.append("producto", producto);
  if (sucursal) params.append("sucursal", sucursal);

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/lotes/existencias${queryString ? `?${queryString}` : ""}`;

  const response =
    await veterinariaAPI.get<ResponseExistenciaProductosInterface[]>(url);
  return response.data;
};
