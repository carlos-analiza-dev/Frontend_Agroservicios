import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSucursaleInterface } from "../interfaces/crear-sucursale.interface";

export const EditarSucursal = async (
  id: string,
  data: Partial<CrearSucursaleInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sucursales/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
