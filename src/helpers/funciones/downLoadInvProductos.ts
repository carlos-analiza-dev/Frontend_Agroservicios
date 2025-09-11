import { ResponseExistenciaProductosInterface } from "@/apis/existencia_productos/interfaces/response-existencia-productos.interface";
import * as XLSX from "xlsx";

export const exportToExcel = (
  filteredData: ResponseExistenciaProductosInterface[] | undefined
) => {
  if (!filteredData || filteredData.length === 0) return;

  const excelData = filteredData.map((item) => ({
    Producto: item.productoNombre,
    Código: item.codigo,
    "Código de Barras": item.codigo_barra,
    Sucursal: item.sucursalNombre,
    Existencia: parseFloat(item.existenciaTotal),
    Estado:
      parseFloat(item.existenciaTotal) > 10
        ? "Disponible"
        : parseFloat(item.existenciaTotal) > 0
          ? "Bajo stock"
          : "Agotado",
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const columnWidths = [
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario Productos");

  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const fileName = `Inventario_Productos_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
