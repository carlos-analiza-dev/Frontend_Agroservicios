import {
  Municipio,
  ResponseMunicipios,
} from "@/apis/municipios/interfaces/response-municipios.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";

interface Props {
  municipios: ResponseMunicipios | undefined;
}

const FormCreateMunicipio = dynamic(() => import("./FormCreateMunicipio"), {
  loading: () => <LoaderComponents />,
});

const TableMunicipios = ({ municipios }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMunicipio, setEditMunicipio] = useState<Municipio | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleEditMunicipio = (municipio: Municipio) => {
    setIsFormOpen(true);
    setIsEdit(true);
    setEditMunicipio(municipio);
  };

  if (!municipios || municipios.municipios.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        No hay municipios registrados
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Municipio</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {municipios.municipios.map((municipio) => (
              <TableRow key={municipio.id}>
                <TableCell className="text-center">
                  <Badge
                    variant={municipio.isActive ? "default" : "destructive"}
                    className="justify-center w-full"
                  >
                    {municipio.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {municipio.nombre}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMunicipio(municipio)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <AlertDialogContent className="w-full md:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Municipio</AlertDialogTitle>
          </AlertDialogHeader>
          <FormCreateMunicipio
            editMunicipio={editMunicipio}
            isEdit={isEdit}
            onSucces={() => setIsFormOpen(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableMunicipios;
