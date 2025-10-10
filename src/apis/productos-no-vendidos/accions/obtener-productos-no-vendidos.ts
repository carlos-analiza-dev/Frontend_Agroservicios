import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductosNoVendidosInterface } from "../interfaces/response-productos-no-vendidos.interface";

export const ObtenerProductosNoVendidos = async (
  limit: number = 10,
  offset: number = 0
) => {
  const params = new URLSearchParams();

  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-no-vendidos?${params.toString()}`;

  const response =
    await veterinariaAPI.get<ResponseProductosNoVendidosInterface>(url);
  return response.data;
};

export default ObtenerProductosNoVendidos;
