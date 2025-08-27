import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { InsumosDisponiblesInterface } from "../interfaces/response-insumos-disponibles.interface";

export const ObtenerInsumosDisponibles = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/insumos/insumos-disponibles`;
  const response = await veterinariaAPI.get<InsumosDisponiblesInterface>(url);
  return response.data;
};

export default ObtenerInsumosDisponibles;
