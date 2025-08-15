import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateRolI } from "../interfaces/crear-rol.interface";

export const AddRol = async (data: CreateRolI) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
