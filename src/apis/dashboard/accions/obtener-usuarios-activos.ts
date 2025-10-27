import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ClientesActivosInterface } from "../interface/response-clientes-activos.interface";

export const ObtenerUsuariosActivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/usuarios-activos`;

  const response = await veterinariaAPI.get<ClientesActivosInterface>(url);

  return response.data;
};
