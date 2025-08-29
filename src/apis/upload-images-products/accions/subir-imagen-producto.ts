import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const SubirImagenProductos = async (
  productoId: string,
  formData: FormData
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/productos-images/upload/${productoId}`;
  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
