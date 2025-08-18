import {
  Departamento,
  ResponseDeptos,
} from "@/apis/departamentos/interfaces/response-departamentos.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import TableMunicipios from "./TableMunicipios";
import useGetMunicipiosByDepto from "@/hooks/municipios/useGetMunicipiosByDepto";

interface Props {
  departamentos: ResponseDeptos | undefined;
  handleEdit: (depto: Departamento) => void;
}

const TableDeptos = ({ departamentos, handleEdit }: Props) => {
  const [deptoId, setDeptoId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: municipios,
    isError,
    isLoading,
  } = useGetMunicipiosByDepto(deptoId);

  const handleViewMunicipios = (deptoId: string) => {
    setIsOpen(true);
    setDeptoId(deptoId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Estado</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Total municipios</TableHead>
            <TableHead>Ver municipios</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departamentos?.departamentos.length ? (
            departamentos.departamentos.map((depto) => (
              <TableRow key={depto.id}>
                <TableCell>
                  <Badge variant={depto.isActive ? "default" : "destructive"}>
                    {depto.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{depto.nombre}</TableCell>
                <TableCell>{depto.municipios.length} municipio(s)</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewMunicipios(depto.id)}
                    variant={"link"}
                  >
                    Ver
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(depto)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No se encontraron departamentos para este país
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="h-[600px] w-full md:max-w-2xl">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Municipios</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion puedes observar los municipios con los que cuenta
              el departamento
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-md border">
            <TableMunicipios municipios={municipios?.data} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableDeptos;
