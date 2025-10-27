import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ClientesActivosInterface } from "../interface/response-clientes-activos.interface";

export const ObtenerClientesActivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/clientes-activos`;

  const response = await veterinariaAPI.get<ClientesActivosInterface>(url);

  return response.data;
};
