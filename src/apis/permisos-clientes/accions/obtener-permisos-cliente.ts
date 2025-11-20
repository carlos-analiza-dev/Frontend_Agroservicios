import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePermisoClienteInterface } from "../interfaces/response-permisos-cliente";

export const ObtenerPermisosClienteId = async (clienteId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-permisos/${clienteId}`;

  const response =
    await veterinariaAPI.get<ResponsePermisoClienteInterface[]>(url);
  return response.data;
};
