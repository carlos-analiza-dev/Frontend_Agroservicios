import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const EliminarImagenProducto = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-images/${id}`;

  const response = await veterinariaAPI.delete(url);
  return response;
};
