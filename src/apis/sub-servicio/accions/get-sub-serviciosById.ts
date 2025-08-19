import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseSubServicios } from "../interface/obtener-sub-serviciosbyservicio.interface";

export const ObtenerSubServiciosById = async (servicioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/${servicioId}`;

  const response = await veterinariaAPI.get<ResponseSubServicios[]>(url);
  return response;
};
