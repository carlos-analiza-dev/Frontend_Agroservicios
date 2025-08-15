import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearMedicoInterface } from "../interfaces/crear-medico.interface";

export const ActualizarMedico = async (
  id: string,
  data: Partial<CrearMedicoInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_UR}/medicos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
