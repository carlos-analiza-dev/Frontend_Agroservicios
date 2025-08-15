import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreatePais } from "../interfaces/crear-pais.interface";

export const ActualizarPaises = async (
  id: string,
  data: Partial<CreatePais>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pais/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
