import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { RendimientoMensualInterface } from "../interface/rendimineto-mensual.interface";

export const ObtenerTendencia = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/tendencia-ingresos`;

  const response = await veterinariaAPI.get<RendimientoMensualInterface>(url);

  return response.data;
};
