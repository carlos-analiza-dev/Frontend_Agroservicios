import { Insumo } from "@/apis/insumos/interfaces/response-insumos.interface";
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
import { Barcode, CheckCircle, Edit, Package, XCircle } from "lucide-react";
import React, { useState } from "react";
import FormInsumos from "./FormInsumos";

interface Props {
  filteredInsumos: Insumo[];
}

const TableInsumos = ({ filteredInsumos }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editInsumo, setEditInsumo] = useState<Insumo | null>(null);

  const handleEditInsumo = (insumo: Insumo) => {
    setIsEdit(true);
    setIsOpen(true);
    setEditInsumo(insumo);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInsumos.map((insumo) => (
            <TableRow key={insumo.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">{insumo.nombre}</div>
                    {insumo.descripcion && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {insumo.descripcion}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Barcode className="h-3 w-3" />
                      {insumo.unidad_venta}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {insumo.codigo}
                </Badge>
              </TableCell>

              <TableCell>
                {insumo.marca ? (
                  <Badge variant="outline">{insumo.marca.nombre}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell>
                {insumo.proveedor ? (
                  <div className="max-w-[120px]">
                    <div className="text-sm font-medium truncate">
                      {insumo.proveedor.nombre_legal}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {insumo.proveedor.nit_rtn}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell>
                <div className="font-semibold text-green-600">
                  {insumo.pais?.simbolo_moneda || "L"}{" "}
                  {Number(insumo.costo).toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={insumo.disponible ? "default" : "secondary"}
                  className={
                    insumo.disponible
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {insumo.disponible ? "Disponible" : "No disponible"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Editar Insumos"
                  onClick={() => handleEditInsumo(insumo)}
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title={
                    insumo.disponible
                      ? "Deshabilitar Insumo"
                      : "Habilitar Insumo"
                  }
                  className="h-8 w-8"
                  onClick={() => {}}
                >
                  {insumo.disponible ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Insumo</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar insumos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormInsumos
            onSuccess={() => setIsOpen(false)}
            editInsumo={editInsumo}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableInsumos;
