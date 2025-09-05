import {
  Compra,
  Lote,
} from "@/apis/compras_productos/interface/response-compras.interface";
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

const TableDetailsLotes = ({ selectedCompra, formatCurrency }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cantidad</TableHead>
          <TableHead>Costo Unitario</TableHead>
          <TableHead>Valor Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedCompra.lotes.map((lote: Lote) => (
          <TableRow key={lote.id}>
            <TableCell>{lote.cantidad}</TableCell>
            <TableCell>{formatCurrency(lote.costo)}</TableCell>
            <TableCell>
              {formatCurrency(
                (parseFloat(lote.cantidad) * parseFloat(lote.costo)).toFixed(2)
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableDetailsLotes;
