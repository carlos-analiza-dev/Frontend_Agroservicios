import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const SubirDocumentosADetalle = async (
  detalleId: string,
  formData: FormData
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-documentos/upload/${detalleId}`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
