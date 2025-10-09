import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseTaxesInterface } from "../interfaces/response-taxes-pais.interface";

export const ObtenerDescuentosByPais = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/descuentos-clientes`;

  const response = await veterinariaAPI.get<ResponseTaxesInterface[]>(url);
  return response.data;
};
