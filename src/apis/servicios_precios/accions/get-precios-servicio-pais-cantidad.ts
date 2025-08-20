import { ResponseSubServicios } from "@/apis/sub-servicio/interface/obtener-sub-serviciosbyservicio.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const ObtenerServicioPaisCantidad = async (
  servicioId: string,
  paisId: string,
  cantidadAnimales: number
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/servicio-pais/${servicioId}/${paisId}/${cantidadAnimales}`;

  const response = await veterinariaAPI.get<ResponseSubServicios>(url);
  return response;
};
