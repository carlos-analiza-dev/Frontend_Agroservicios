import { ResponseTaxesInterface } from "@/apis/impuestos/interfaces/response-taxes-pais.interface";
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
import { Edit } from "lucide-react";
import React, { useState } from "react";
import FormImpuestos from "./FormImpuestos";
import { StatusMessage } from "@/components/generics/StatusMessage";

interface Props {
  impuestos: ResponseTaxesInterface[] | undefined;
  tipo: "impuesto" | "descuento";
}

const TableImpuestos = ({ impuestos, tipo }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editImpuesto, setEditImpuesto] =
    useState<ResponseTaxesInterface | null>(null);

  const handleEditImpuesto = (imp: ResponseTaxesInterface) => {
    setIsEdit(true);
    setIsOpen(true);
    setEditImpuesto(imp);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Nombre</TableHead>
            <TableHead className="text-center font-bold">Porcentaje</TableHead>
            <TableHead className="text-center font-bold">País</TableHead>

            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {impuestos && impuestos.length > 0 ? (
            impuestos.map((impuesto) => (
              <TableRow key={impuesto.id}>
                <TableCell className="text-center">{impuesto.nombre}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="text-sm">
                    {impuesto.porcentaje}%
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-center">
                    <span className="fi fi-{impuesto.pais.code.toLowerCase()}"></span>
                    {impuesto.pais.nombre}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Editar Impuesto"
                    onClick={() => handleEditImpuesto(impuesto)}
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                <div className="flex justify-center py-4">
                  <StatusMessage type="empty" />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Impuesto</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar los diferentes tipos de impuesto
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormImpuestos
            onSuccess={() => setIsOpen(false)}
            editImpuesto={editImpuesto}
            isEdit={isEdit}
            tipo={tipo}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableImpuestos;
