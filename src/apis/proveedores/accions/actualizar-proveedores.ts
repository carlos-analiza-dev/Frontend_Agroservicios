import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearProveedorInterface } from "../interfaces/crear-proveedor.interface";

export const ActualizarProveedor = async (
  id: string,
  data: Partial<CrearProveedorInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/proveedores/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
