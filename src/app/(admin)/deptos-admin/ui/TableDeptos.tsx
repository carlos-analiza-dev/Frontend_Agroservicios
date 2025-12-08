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
import useGetMunicipiosByDepto from "@/hooks/municipios/useGetMunicipiosByDepto";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import { StatusMessage } from "@/components/generics/StatusMessage";

interface Props {
  departamentos: ResponseDeptos | undefined;
  handleEdit: (depto: Departamento) => void;
}

const FormCreateMunicipio = dynamic(() => import("./FormCreateMunicipio"), {
  loading: () => <LoaderComponents />,
});

const TableMunicipios = dynamic(() => import("./TableMunicipios"), {
  loading: () => <TableUsersSkeleton />,
});

const TableDeptos = ({ departamentos, handleEdit }: Props) => {
  const [deptoId, setDeptoId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: municipios } = useGetMunicipiosByDepto(deptoId);

  const handleViewMunicipios = (deptoId: string) => {
    setIsOpen(true);
    setDeptoId(deptoId);
  };

  const handleAddMunicipio = () => {
    setIsFormOpen(true);
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
          {departamentos?.departamentos &&
          departamentos?.departamentos.length ? (
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
        <AlertDialogContent className="w-full md:max-w-2xl max-h-[600px] overflow-y-auto">
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
          <div className="flex justify-end">
            <Button onClick={handleAddMunicipio}>Agregar +</Button>
          </div>
          <div className="rounded-md border">
            <TableMunicipios municipios={municipios?.data} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <AlertDialogContent className="w-full md:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Crear Municipio</AlertDialogTitle>
          </AlertDialogHeader>
          <FormCreateMunicipio
            deptoId={deptoId}
            departamentos={departamentos?.departamentos || []}
            onSucces={() => setIsFormOpen(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableDeptos;
