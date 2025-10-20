import { ResponseMovimientosProductosInterface } from "@/apis/movimientos-productos/interfaces/response-movimientos-productos.interface";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/helpers/funciones/formatDate";
import { User } from "@/interfaces/auth/user";
import React from "react";

interface Props {
  movimientosData: ResponseMovimientosProductosInterface | undefined;
  user: User | undefined;
}

const TableMovimientosProductos = ({ movimientosData, user }: Props) => {
  const simbolo = user?.pais.simbolo_moneda;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Factura</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movimientosData?.data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-muted-foreground py-8"
            >
              No se encontraron movimientos
            </TableCell>
          </TableRow>
        ) : (
          movimientosData?.data.map((movimiento) => (
            <TableRow key={movimiento.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {movimiento.producto.nombre}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {movimiento.producto.codigo}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    movimiento.tipo === "ENTRADA" ? "default" : "destructive"
                  }
                  className={
                    movimiento.tipo === "ENTRADA"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {movimiento.tipo}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className={
                    movimiento.tipo === "ENTRADA"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {movimiento.tipo === "ENTRADA" ? "+" : "-"}
                  {Math.abs(parseFloat(movimiento.cantidad))}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  <span>{movimiento.cantidad_anterior}</span>
                  <span className="mx-2">→</span>
                  <span>{movimiento.cantidad_nueva}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">
                    {movimiento.factura.numero_factura}
                  </div>
                  <div className="text-muted-foreground">
                    {simbolo}
                    {parseFloat(movimiento.factura.total).toLocaleString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDate(movimiento.fecha)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {movimiento.descripcion}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableMovimientosProductos;
