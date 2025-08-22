import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Proveedor } from "../interfaces/response-proveedores.interface";

export const ObtenerProveedoresActivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/proveedores/activos`;

  const response = await veterinariaAPI.get<Proveedor[]>(url);
  return response.data;
};
