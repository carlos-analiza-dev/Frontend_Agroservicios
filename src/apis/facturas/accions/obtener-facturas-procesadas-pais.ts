import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Factura } from "../interfaces/response-facturas.interface";

interface FiltrosFacturas {
  sucursal?: string;
}

export const ObtenerFacturasProcesadas = async (
  filtros: FiltrosFacturas = {}
) => {
  const { sucursal } = filtros;
  const params = new URLSearchParams();

  if (sucursal) {
    params.append("sucursal", sucursal);
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/factura-encabezado/procesadas?${params.toString()}`;

  const response = await veterinariaAPI.get<Factura[]>(url);
  return response.data;
};
