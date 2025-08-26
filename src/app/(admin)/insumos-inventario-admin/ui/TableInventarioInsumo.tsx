import { Inventario } from "@/apis/inventario-insumos/interfaces/response-inventarios-insumos.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Edit, XCircle } from "lucide-react";
import React, { useState } from "react";
import FormInventario from "./FormInventario";

interface Props {
  filteredInventario: Inventario[];
}

const TableInventarioInsumo = ({ filteredInventario }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editarInventario, setEditarInventario] = useState<Inventario | null>(
    null
  );

  const handleEditInventario = (inv: Inventario) => {
    setIsEdit(true);
    setIsOpen(true);
    setEditarInventario(inv);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Insumo</TableHead>
            <TableHead className="text-center">Marca</TableHead>
            <TableHead className="text-center">Proveedor</TableHead>
            <TableHead className="text-center">Stock Disponible</TableHead>
            <TableHead className="text-center">Stock Mínimo</TableHead>
            <TableHead className="text-center">Costo</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventario.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">
                <div>
                  <div className="font-medium">{item.insumo?.nombre}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.insumo?.codigo}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {item.insumo?.marca.nombre}
              </TableCell>
              <TableCell className="text-center">
                {item.insumo?.proveedor.nombre_legal}
              </TableCell>
              <TableCell className="text-center">
                <span className="font-semibold">
                  {item.cantidadDisponible} {item.insumo?.unidad_venta}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {item.stockMinimo} {item.insumo?.unidad_venta}
              </TableCell>
              <TableCell className="text-center">
                {item.insumo?.pais.simbolo_moneda} {item.insumo?.costo}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    item.cantidadDisponible <= item.stockMinimo
                      ? "destructive"
                      : "default"
                  }
                >
                  {item.cantidadDisponible <= item.stockMinimo ? (
                    <>
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Bajo Stock
                    </>
                  ) : (
                    "Disponible"
                  )}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Editar Inventario"
                  onClick={() => handleEditInventario(item)}
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            {" "}
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Inventario de Insumos</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar inventario a tus insumos disponibles
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormInventario
            onSuccess={() => setIsOpen(false)}
            editInventario={editarInventario}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableInventarioInsumo;
