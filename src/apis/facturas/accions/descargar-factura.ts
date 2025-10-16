import axios from "axios";
import { Factura } from "../interfaces/response-facturas.interface";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const descargarFacturaPDFConAxios = async (
  id: string,
  factura: Factura
) => {
  try {
    const url_api = `/facturas/${id}/pdf`;

    const response = await veterinariaAPI.get(url_api, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    if (!response.data || response.data.size === 0) {
      throw new Error("El archivo PDF está vacío");
    }

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `factura_${factura.numero_factura}.pdf`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    return { success: true, message: "Factura descargada exitosamente" };
  } catch (error) {
    let errorMessage = "Error al descargar la factura";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifique su internet.";
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
