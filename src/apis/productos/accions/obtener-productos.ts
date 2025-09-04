import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductos } from "../interfaces/response-productos.interface";

export const ObtenerProductos = async (
  limit: number = 10,
  offset: number = 0,
  pais: string = "",
  categoria: string = "",
  marca: string = "",
  proveedor: string = ""
) => {
  const params = new URLSearchParams();

  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  if (pais) params.append("pais", pais);
  if (categoria) params.append("categoria", categoria);
  if (marca) params.append("marca", marca);
  if (proveedor) params.append("proveedor", proveedor);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos?${params.toString()}`;

  const response = await veterinariaAPI.get<ResponseProductos>(url);
  return response;
};

export default ObtenerProductos;
