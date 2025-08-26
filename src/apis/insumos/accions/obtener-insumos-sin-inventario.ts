import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Insumo } from "@/apis/inventario-insumos/interfaces/response-inventarios-insumos.interface";

export const ObtenerInsumosSinInventario = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/insumos/insumos-sin-inventario`;
  const response = await veterinariaAPI.get<Insumo[]>(url);
  return response.data;
};

export default ObtenerInsumosSinInventario;
