import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearProveedorInterface } from "../interfaces/crear-proveedor.interface";

export const CrearProveedor = async (data: CrearProveedorInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/proveedores`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
