export const handleDownload = (documentoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/historial-documentos/descargar/${documentoId}`;
  window.open(url, "_blank");
};
