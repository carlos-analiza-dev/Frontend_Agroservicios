import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { User } from "@/interfaces/auth/user";
import { CrearUsuario } from "../interfaces/create-user.interface";

export const actualizarUsuario = async (
  userId: string,
  data: Partial<CrearUsuario>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/user-update/${userId}`;

  const response = await veterinariaAPI.patch<User>(url, data);

  return response.data;
};
