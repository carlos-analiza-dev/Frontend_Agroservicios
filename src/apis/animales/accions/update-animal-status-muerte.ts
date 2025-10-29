import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearAnimalByFinca } from "../interfaces/crear-animal.interface";

export const ActualizarAnimalMuerte = async (
  id: string,
  data: Partial<CrearAnimalByFinca>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}/death-status`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
