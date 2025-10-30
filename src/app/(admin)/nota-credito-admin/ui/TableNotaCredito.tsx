import { ResponseNotaCreditoInterface } from "@/apis/nota-credito/interface/response-nota-credito.interface";
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
import { formatDate } from "@/helpers/funciones/formatDate";
import { Calendar, DollarSign, FileText, User } from "lucide-react";
import React from "react";

interface Props {
  notas_credito: ResponseNotaCreditoInterface;
}

const TableNotaCredito = ({ notas_credito }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">N° de Nota</TableHead>
          <TableHead className="text-center">Factura</TableHead>
          <TableHead className="text-center">Monto</TableHead>

          <TableHead className="text-center">Motivo</TableHead>
          <TableHead className="text-center">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notas_credito.notas.map((nota) => (
          <TableRow key={nota.id}>
            <TableCell className="font-medium text-center">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {nota.id.slice(0, 8)}...
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="space-y-1">
                <div className="font-medium">{nota.factura.numero_factura}</div>
                <Badge variant="outline" className="text-xs">
                  {nota.factura.estado}
                </Badge>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-center  gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold">
                  {formatCurrency(nota.monto, nota.pais.simbolo_moneda)}
                </span>
              </div>
            </TableCell>

            <TableCell className="max-w-[200px] text-center truncate">
              {nota.motivo}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(nota.createdAt)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableNotaCredito;
