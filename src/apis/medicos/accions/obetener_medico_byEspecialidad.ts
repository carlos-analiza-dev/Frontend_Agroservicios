import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Medico } from "../interfaces/obtener-medicos.interface";

export const ObtenerMedicoByEspecialidad = async (especialidadId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/medicos/especialidad/${especialidadId}`;
  const response = await veterinariaAPI.get<Medico[]>(url);
  return response.data;
};
