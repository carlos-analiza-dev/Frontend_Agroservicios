import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateCitaProductoInterface } from "../interface/create-cita-producto.interface";

export const CreateCitaProducto = async (data: CreateCitaProductoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cita-productos`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
