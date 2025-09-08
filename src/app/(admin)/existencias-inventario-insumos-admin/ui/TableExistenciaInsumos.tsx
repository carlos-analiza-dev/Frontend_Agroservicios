import { ResponseExistenciaInsumosInterface } from "@/apis/existencia_insumos/interfaces/response-exsistencia-insumos.interface";
import { Badge } from "@/components/ui/badge";
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
  filteredData: ResponseExistenciaInsumosInterface[];
}

const TableExistenciaInsumos = ({ filteredData }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Insumo</TableHead>
          <TableHead className="text-center">Código</TableHead>
          <TableHead className="text-center">Sucursal</TableHead>
          <TableHead className="text-center">País</TableHead>
          <TableHead className="text-center">Inventario</TableHead>
          <TableHead className="text-center">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={`${item.insumoId}-${item.sucursalId}`}>
            <TableCell className="text-center">
              <div>
                <div className="font-medium">{item.insumoNombre}</div>
              </div>
            </TableCell>
            <TableCell className="text-center">{item.codigo}</TableCell>
            <TableCell className="text-center">{item.sucursalNombre}</TableCell>
            <TableCell className="text-center">{item.paisNombre}</TableCell>
            <TableCell className="text-center">
              {parseFloat(item.existenciaTotal).toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant={
                  parseFloat(item.existenciaTotal) > 10
                    ? "default"
                    : parseFloat(item.existenciaTotal) > 0
                      ? "secondary"
                      : "destructive"
                }
              >
                {parseFloat(item.existenciaTotal) > 10
                  ? "Disponible"
                  : parseFloat(item.existenciaTotal) > 0
                    ? "Bajo stock"
                    : "Agotado"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableExistenciaInsumos;
