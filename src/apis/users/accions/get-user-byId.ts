import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { User, UserUpdateData } from "@/interfaces/auth/user";

export const obtenerUsuarioById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/user/${id}`;
  const respose = await veterinariaAPI.get<User>(url);
  return respose;
};
