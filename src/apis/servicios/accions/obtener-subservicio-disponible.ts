import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ObtenerSubServicioDisponibleInterface } from "../interfaces/obtener-subservicio-disponibles";

export const ObtenerSubServiciosDisponibles = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/servicios-disponibles`;

  const response =
    await veterinariaAPI.get<ObtenerSubServicioDisponibleInterface>(url);
  return response;
};

export default ObtenerSubServiciosDisponibles;
