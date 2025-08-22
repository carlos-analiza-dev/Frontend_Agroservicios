import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateMarcaInterface } from "../interface/crear-marca.interface";

export const ActualizarMarca = async (
  id: string,
  data: Partial<CreateMarcaInterface>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marcas/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
