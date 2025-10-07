import { Factura } from "../interfaces/response-facturas.interface";

export const handlePreviewFactura = (factura: Factura) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/facturas/${factura.id}/preview`;
  window.open(url, "_blank");
};
