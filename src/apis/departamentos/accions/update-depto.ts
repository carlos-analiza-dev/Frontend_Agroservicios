import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateDepartamento } from "../interfaces/create-departamento.interface";

export const ActualizarDepto = async (
  id: string,
  data: Partial<CreateDepartamento>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/departamentos-pais/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
