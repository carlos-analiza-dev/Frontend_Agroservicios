import { Compra } from "@/apis/compras_productos/interface/response-compras.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface Props {
  selectedCompra: Compra;
  formatCurrency: (amount: string) => string;
}

const TableDetailsProductos = ({ selectedCompra, formatCurrency }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Costo Unitario</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Bonificación</TableHead>
          <TableHead>Total Unidades</TableHead>
          <TableHead>Descuento</TableHead>
          <TableHead>Impuestos</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedCompra.detalles.map((detalle) => (
          <TableRow key={detalle.id}>
            <TableCell>{detalle.productoId}</TableCell>
            <TableCell>{formatCurrency(detalle.costo_por_unidad)}</TableCell>
            <TableCell>{detalle.cantidad}</TableCell>
            <TableCell>{detalle.bonificacion}</TableCell>
            <TableCell>{detalle.cantidad_total}</TableCell>
            <TableCell>{formatCurrency(detalle.descuentos)}</TableCell>
            <TableCell>{formatCurrency(detalle.impuestos)}</TableCell>
            <TableCell>{formatCurrency(detalle.monto_total)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableDetailsProductos;
