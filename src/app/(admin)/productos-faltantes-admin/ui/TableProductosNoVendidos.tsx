import { ProductoNoVendido } from "@/apis/productos-no-vendidos/interfaces/response-productos-no-vendidos.interface";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { Calendar } from "lucide-react";
import React from "react";

interface Props {
  filteredProductos: ProductoNoVendido[];
  simbolo: string;
}

const TableProductosNoVendidos = ({ filteredProductos, simbolo }: Props) => {
  const getMotivoBadgeVariant = (motivo: string) => {
    switch (motivo) {
      case "Sin_Stock":
        return "destructive";
      case "Venta_Incompleta":
        return "secondary";
      case "Vencido":
        return "outline";
      default:
        return "default";
    }
  };

  const getMotivoText = (motivo: string) => {
    switch (motivo) {
      case "Sin_Stock":
        return "Sin Stock";
      case "Venta_Incompleta":
        return "Venta incompleta";
      case "Vencido":
        return "Vencido";
      default:
        return motivo;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-HN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Producto</TableHead>
          <TableHead className="text-center">Sucursal</TableHead>
          <TableHead className="text-center">Cantidad No Vendida</TableHead>
          <TableHead className="text-center">Existencia Actual</TableHead>
          <TableHead className="text-center">Pérdida</TableHead>
          <TableHead className="text-center">Fecha del Reporte</TableHead>
          <TableHead className="text-center">Motivo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProductos.map((producto) => (
          <TableRow key={producto.id}>
            <TableCell className="text-center">
              <div>
                <p className="font-medium text-gray-900">
                  {producto.nombre_producto}
                </p>
                <p className="text-sm text-gray-500">
                  {producto.producto.codigo}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div>
                <p className="font-medium text-gray-900">
                  {producto.sucursal.nombre}
                </p>
                <p className="text-sm text-gray-500">
                  {producto.sucursal.municipio.nombre}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-center">
              {producto.cantidad_no_vendida} {producto.producto.unidad_venta}
            </TableCell>
            <TableCell className="text-center">
              <span
                className={
                  producto.existencia_actual === 0
                    ? "text-red-600 font-medium"
                    : "text-gray-900"
                }
              >
                {producto.existencia_actual} {producto.producto.unidad_venta}{" "}
                (as)
              </span>
            </TableCell>
            <TableCell className="text-center font-medium text-red-600">
              {formatCurrency(producto.total_perdido, simbolo)}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formatDate(producto.created_at)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant={getMotivoBadgeVariant(producto.motivo)}>
                {getMotivoText(producto.motivo)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableProductosNoVendidos;
