import { ResponseExistenciaInsumosInterface } from "@/apis/existencia_insumos/interfaces/response-exsistencia-insumos.interface";
import * as XLSX from "xlsx";

export const exportToExcelInvInsumos = (
  filteredData: ResponseExistenciaInsumosInterface[] | undefined
) => {
  if (!filteredData || filteredData.length === 0) return;

  const excelData = filteredData.map((item) => ({
    Insumo: item.insumoNombre,
    Código: item.codigo,
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
    { wch: 12 },
    { wch: 15 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario Insumos");

  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const fileName = `Inventario_Insumos_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
