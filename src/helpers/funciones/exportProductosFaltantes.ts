import * as XLSX from "xlsx";
import { ProductoNoVendido } from "@/apis/productos-no-vendidos/interfaces/response-productos-no-vendidos.interface";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";

export const exportProductosFaltantes = (
  filteredData: ProductoNoVendido[] | undefined,
  simbolo: string
) => {
  if (!filteredData || filteredData.length === 0) return;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-HN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getMotivoText = (motivo: string) => {
    switch (motivo) {
      case "Sin_Stock":
        return "Sin Stock";
      case "Venta_Incompleta":
        return "Venta Incompleta";
      case "Vencido":
        return "Vencido";
      default:
        return motivo;
    }
  };

  const excelData = filteredData.map((item) => ({
    Producto: item.nombre_producto,
    Código: item.producto.codigo,
    Sucursal: item.sucursal.nombre,
    "Cantidad No Vendida": `${item.cantidad_no_vendida} ${item.producto.unidad_venta}`,
    "Existencia Actual": `${item.existencia_actual} ${item.producto.unidad_venta}`,
    Pérdida: formatCurrency(item.total_perdido, simbolo),
    "Fecha del Reporte": formatDate(item.created_at),
    Motivo: getMotivoText(item.motivo),
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const columnWidths = [
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 15 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos Faltantes");

  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const fileName = `Productos_Faltantes_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
