import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { RendimientoMensualInterface } from "../interface/rendimineto-mensual.interface";

export const ObtenerRendimientoMensual = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/rendimiento-mensual`;

  const response = await veterinariaAPI.get<RendimientoMensualInterface>(url);

  return response.data;
};
