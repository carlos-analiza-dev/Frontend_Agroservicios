import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarDocumento = async (documentoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-documentos/${documentoId}`;
  const response = await veterinariaAPI.delete(url);
  return response.data;
};
