import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearSucursaleInterface } from "../interfaces/crear-sucursale.interface";

export const CrearSucursal = async (data: CrearSucursaleInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sucursales`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
