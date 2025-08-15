import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseUsers } from "../interfaces/users-response.interface";

export const obtenerUsuarios = async (
  limit: number = 10,
  offset: number = 0,
  name: string = "",
  rol: string = "",
  pais: string = ""
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/users?limit=${limit}&offset=${offset}&name=${name}&rol=${rol}&pais=${pais}`;
  const respose = await veterinariaAPI.get<ResponseUsers>(url);
  return respose;
};
