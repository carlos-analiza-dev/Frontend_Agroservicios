import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseInterfazPais } from "../interfaces/response-sucursal-pais.interface";

export const ObtenerSucursalesPais = async (paisId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sucursales/pais-suc/${paisId}`;

  const response = await veterinariaAPI.get<ResponseInterfazPais[]>(url);
  return response.data;
};
