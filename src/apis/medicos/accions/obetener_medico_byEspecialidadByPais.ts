import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Medico } from "../interfaces/obtener-medicos.interface";

export const ObtenerMedicoByEspecialidadesByPais = async (
  paisId: string,
  especialidadId: string
) => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/medicos/especialidad/${paisId}/${especialidadId}`;
  const response = await veterinariaAPI.get<Medico[]>(url);
  return response.data;
};
