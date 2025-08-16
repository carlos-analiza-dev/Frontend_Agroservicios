import { PaisesResponse } from "@/apis/paises/interfaces/paises.response.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import React, { useState } from "react";
import FormCrearPais from "./FormCrearPais";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { ActualizarPaises } from "@/apis/paises/accions/update-pais";
import { toast } from "react-toastify";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

interface Props {
  paises: PaisesResponse[] | undefined;
}

const TablePaises = ({ paises }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editPais, setEditPais] = useState<PaisesResponse | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [activo, setActivo] = useState(false);
  const [paisId, setPaisId] = useState("");

  const handleEditPais = (pais: PaisesResponse) => {
    setEditPais(pais);
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleToggleActive = async (isActive: boolean) => {
    try {
      await ActualizarPaises(paisId, { isActive });
      queryClient.invalidateQueries({ queryKey: ["paises"] });
      toast.success("Estado del pais actualizado");
    } catch (error) {
      toast.error(
        "Ocurrio un error al momento de actualizar el estado del pais"
      );
    } finally {
      setPaisId("");
      setOpen2(false);
    }
  };

  const handleActivePais = (actividad: boolean, paisId: string) => {
    setOpen2(true);
    setActivo(actividad);
    setPaisId(paisId);
  };

  return (
    <>
      <Table>
        <TableCaption>Lista de Paises</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Nombre</TableHead>
            <TableHead className="text-center font-bold">
              Nombre Documento
            </TableHead>
            <TableHead className="text-center font-bold">
              Nombre Moneda
            </TableHead>
            <TableHead className="text-center font-bold">
              Simbolo Moneda
            </TableHead>
            <TableHead className="text-center font-bold">Codigo Pais</TableHead>

            <TableHead className="text-center font-bold">
              Codigo Telefono
            </TableHead>
            <TableHead className="text-center font-bold">Estado</TableHead>
            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paises?.map((pais) => (
            <TableRow key={pais.id}>
              <TableCell className="text-center">{pais.nombre}</TableCell>
              <TableCell className="text-center">
                {pais.nombre_documento}
              </TableCell>
              <TableCell className="text-center">
                {pais.nombre_moneda}
              </TableCell>
              <TableCell className="text-center">
                {pais.simbolo_moneda}
              </TableCell>
              <TableCell className="text-center">{pais.code}</TableCell>
              <TableCell className="text-center">{pais.code_phone}</TableCell>
              <TableCell className="text-center">
                {" "}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pais.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {pais.isActive ? "Sí" : "No"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditPais(pais)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar Pais</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleActivePais(pais.isActive, pais.id)
                          }
                        >
                          {pais.isActive ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {pais.isActive ? "Desactivar Pais" : "Activar Pais"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 max-h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Pais</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar el pais seleccionado
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <FormCrearPais
              editPais={editPais}
              isEdit={isEdit}
              onSucces={() => setIsOpen(false)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open2} onOpenChange={setOpen2}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setOpen2(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Actividad Pais</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puedes editar el estado activo del pais
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button onClick={() => handleToggleActive(!activo)}>
              {!activo ? "Activar" : "Desactivar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TablePaises;
